const http = require('http');
const https = require('https');
const assert = require('assert');
const Stream = require('stream');

const request = (method, url, payload, headers) => {
  console.log(url, payload);
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

const get = (url, headers) =>
  request('get', url, '', headers);

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

const defaultColor = [
  0, 255, 0
];

class Awtrix {
  constructor({ api }) {
    this.api = api;
  }
  call(path, body) {
    return postJSON(this.api + path, body);
  }
  get_settings() {
    return this.call('/basics', { "get": "settings" });
  }
  set(key, value) {
    return this.call('/settings', { [key]: value });
  }
  brightness(value) {
    return this.set('Brightness', value);
  }
  draw(arr, { repeat = 1 } = {}) {
    return this.call('/draw', { draw: arr, repeat })
  }
  notify(text, {
    icon = 6,
    force = false,
    moveIcon = true,
    repeat = 1,
    soundfile = 1,
    name = 'TestNotification',
    color = defaultColor,
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