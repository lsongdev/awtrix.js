const http = require('http');
const https = require('https');
const assert = require('assert');
const Stream = require('stream');

const request = (method, url, payload, headers) => {
  const client = url.startsWith('https://') ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.request(url, {
      method,
      headers,
    }, resolve);
    req.once('error', reject);
    if (payload instanceof Stream) {
      payload.pipe(req);
    } else {
      req.end(payload);
    }
  });
};

const readStream = stream => {
  const buffer = [];
  return new Promise((resolve, reject) => {
    stream
      .on('error', reject)
      .on('data', chunk => buffer.push(chunk))
      .on('end', () => resolve(Buffer.concat(buffer)))
  });
};

const ensureStatusCode = expected => {
  if (!Array.isArray(expected))
    expected = [expected];
  return res => {
    const { statusCode } = res;
    assert.ok(expected.includes(statusCode), `status code must be "${expected}" but actually "${statusCode}"`);
    return res;
  };
};

const post = (url, payload, headers) =>
  request('post', url, payload, headers);

const postJSON = (url, payload) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  return Promise
    .resolve()
    .then(() => post(url, JSON.stringify(payload), headers))
    .then(ensureStatusCode(200))
    .then(readStream)
    .then(res => res.length ? JSON.parse(res) : res);
}

class Awtrix {
  constructor({ api }) {
    this.api = api;
  }
  call(path, body) {
    return postJSON(this.api + path, body);
  }
  /**
   * Basic Controls
   * https://awtrixdocs.blueforcer.de/#/en-en/api?id=basic-controls
   * @param {*} payload 
   * @returns 
   */
  call_basics(payload) {
    return this.call('/basics', payload);
  }
  /**
   * https://awtrixdocs.blueforcer.de/#/en-en/api?id=power
   * @param {*} state 
   * @returns 
   */
  power(state = true) {
    return this.call_basics({ power: state });
  }
  power_on() {
    return this.power(true);
  }
  power_off() {
    return this.power(false);
  }
  /**
   * https://awtrixdocs.blueforcer.de/#/en-en/api?id=switchto
   * @param {*} app 
   * @returns 
   */
  switchTo(app) {
    return this.call_basics({ switchTo: app });
  }
  /**
   * https://awtrixdocs.blueforcer.de/#/en-en/api?id=appstate
   * @param {*} app 
   * @returns 
   */
  enable(app) {
    return this.call_basics({ enable: app });
  }
  /**
   * https://awtrixdocs.blueforcer.de/#/en-en/api?id=appstate
   * @param {*} app 
   * @returns 
   */
  disable(app) {
    return this.call_basics({ disable: app })
  }
  /**
   * https://awtrixdocs.blueforcer.de/#/en-en/api?id=apploop
   * @param {*} app 
   * @returns 
   */
  next(app) {
    return this.call_basics({ next: app });
  }
  /**
   * https://awtrixdocs.blueforcer.de/#/en-en/api?id=showanimation
   * @param {*} effect 
   * @returns 
   */
  showAnimation(effect) {
    return this.call_basics({ showAnimation: effect });
  }
  /**
   * https://awtrixdocs.blueforcer.de/#/en-en/api?id=soundfile
   * @param {*} id 
   * @returns 
   */
  soundfile(id) {
    return this.call_basics({ soundfile: id });
  }
  /**
   * https://awtrixdocs.blueforcer.de/#/en-en/api?id=timer
   * @param {*} timer 
   * @param {*} param1 
   * @returns 
   */
  timer(timer, { soundfile, color, count, text } = {}) {
    return this.call_basics({ timer, soundfile, color, count, text });
  }
  /**
   * https://awtrixdocs.blueforcer.de/#/en-en/api?id=stopwatch
   * @param {*} icon 
   * @returns 
   */
  stopwatch(icon) {
    const start = !!icon;
    return this.call_basics({ stopwatch: start, icon });
  }
  stopwatch_stop() {
    return this.stopwatch(false);
  }
  /**
   * https://awtrixdocs.blueforcer.de/#/en-en/api?id=yeelight
   * @param {*} effect 
   * @param {*} duration 
   * @returns 
   */
  yeelight(effect, duration = 10) {
    return this.call_basics({ yeelight: [effect, duration] });
  }
  get(key) {
    return this.call_basics({ get: key })
  }
  get_settings() {
    return this.get('settings');
  }
  get_installedApps() {
    return this.get('installedApps');
  }
  get_version() {
    return this.get('version');
  }
  get_uptime() {
    return this.get('uptime');
  }
  get_power_state() {
    return this.get('powerState');
  }
  get_log() {
    return this.get('log');
  }
  get_matrixInfo() {
    return this.get('matrixInfo');
  }
  /**
   * Change settings
   * https://awtrixdocs.blueforcer.de/#/en-en/api?id=change-settings
   * @param {*} key 
   * @param {*} value 
   * @returns 
   */
  set(key, value) {
    return this.call('/settings', { [key]: value });
  }
  brightness(value = 75) {
    return this.set('Brightness', value);
  }
  /**
   * Notifications
   * https://awtrixdocs.blueforcer.de/#/en-en/api?id=notifications
   * @param {*} text 
   * @param {*} param1 
   * @returns 
   */
  notify(text, {
    icon = 6,
    force = false,
    moveIcon = true,
    repeat = 1,
    soundfile = 1,
    name = 'TestNotification',
    color = new Awtrix.Color(),
  } = {}) {
    return this.call('/notify', {
      name,
      text,
      icon,
      color,
      force,
      repeat,
      moveIcon,
      soundfile,
    });
  }
  /**
   * Drawing
   * https://awtrixdocs.blueforcer.de/#/en-en/api?id=drawing
   * @param {*} arr 
   * @param {*} param1 
   * @returns 
   */
  draw(arr, { repeat = 1 } = {}) {
    return this.call('/draw', { draw: arr, repeat })
  }
}

Awtrix.Effect = class {
  constructor(type) {
    this.type = type;
  }
}

Awtrix.Fill = class extends Awtrix.Effect {
  constructor(r, g, b) {
    super('fill');
    this.color = [r, g, b];
  }
}

Awtrix.Color = class extends Array {
  constructor(r = 0, g = 0, b = 255) {
    super();
    this[0] = r;
    this[1] = g;
    this[2] = b;
  }
}

Awtrix.Text = class extends Awtrix.Effect {
  constructor(text) {
    super('text');
    this.string = text;
    this.color = new Awtrix.Color();
    this.position = new Awtrix.Position();
  }
}

Awtrix.Position = class extends Array {
  constructor(x = 0, y = 0) {
    super();
    this[0] = x;
    this[1] = y;
  }
}

Awtrix.Show = class extends Awtrix.Effect {
  constructor() {
    super('show');
  }
}

Awtrix.Wait = class extends Awtrix.Effect {
  constructor(ms) {
    super('wait');
    this.ms = ms;
  }
}

Awtrix.Rect = class extends Awtrix.Effect {
  constructor(width, height) {
    super('rect');
    this.size = [width, height];
    this.color = new Awtrix.Color();
    this.position = new Awtrix.Position();
  }
}

Awtrix.Line = class extends Awtrix.Effect {
  constructor() {
    super('line');
    this.start = new Awtrix.Position();
    this.end = new Awtrix.Position();
    this.color = new Awtrix.Color();
  }
}

Awtrix.Circle = class extends Awtrix.Effect {
  constructor(radius = 3) {
    super('circle');
    this.radius = radius;
    this.color = new Awtrix.Color();
    this.position = new Awtrix.Position();
  }
}

Awtrix.Clear = class extends Awtrix.Effect {
  constructor() {
    super('clear');
  }
}

Awtrix.Exit = class extends Awtrix.Effect {
  constructor() {
    super('exit');
  }
}

module.exports = Awtrix;