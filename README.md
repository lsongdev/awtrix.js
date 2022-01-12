## Awtrix

> Awtrix in JavaScript

https://awtrixdocs.blueforcer.de/#/en-en/api

### Install

```sh
~$ npm i awtrix --save
```

### Command-line Usage

```sh
~$ npm i -g awtrix
~$ export AWTRIX_API=https://awtrix.lsong.me/api/v3
~$ awtrix

  awtrix 0.0.0

  Usage: awtrix <command>

  Commands:

  get_settings
  set <key> <value>
  brightness <value>
  notify <text>
  draw <array>

  Examples:

  awtrix get_settings
  awtrix set Brightness 50
  awtrix brightness 50
  awtrix notify "Hello World"
```

### Example

```js
const Awtrix = require('awtrix');

const awtrix = new Awtrix({
  api: 'https://awtrix.lsong.me/api/v3',
});
```

get settings:

```js
(async () => {
  const settings = await awtrix.get_settings();
  console.log(settings);
})();
```

set brightness:

```js
(async () => {
  await awtrix.brightness(50);
})();
```

notify:

```js
(async () => {
  await awtrix.notify('hello');
})();
```

draw:

```js

(async () => {

  const show = new Awtrix.Show();
  const wait = new Awtrix.Wait(1000);
  const clear = new Awtrix.Clear();
  const fill = new Awtrix.Fill(50, 50, 50);
  const text = new Awtrix.Text('Hello World');
  text.position = new Awtrix.Position(4, 1);
  text.color = new Awtrix.Color(255, 0, 0);

  const circle = new Awtrix.Circle(3);
  circle.position = new Awtrix.Position(4, 4);
  circle.color = new Awtrix.Color(255, 0, 255);

  const rect = new Awtrix.Rect(5, 5);
  rect.position = new Awtrix.Position(24, 2);
  rect.color = new Awtrix.Color(0, 0, 255);


  const line = new Awtrix.Line();
  line.start = new Awtrix.Position(0, 0);
  line.end = new Awtrix.Position(10, 10);
  line.color = new Awtrix.Color(255, 0, 0);

  const exit = new Awtrix.Exit();

  await awtrix.draw([
    fill,
    text,
    show,
    wait,
    circle,
    show,
    wait,
    rect,
    show,
    wait,
    clear,
    line,
    show,
    wait,
    exit,

  ]);
})();

```

### License

  MIT @ Lsong <hi@lsong.org>
