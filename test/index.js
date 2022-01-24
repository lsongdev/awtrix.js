const Awtrix = require('..');
const assert = require('assert');

const awtrix = new Awtrix({
  api: 'https://awtrix.lsong.me/api/v3',
});

const test = async (name, fn) => {
  try {
    await fn();
    console.log(("✓ " + name));
  } catch (err) {
    console.error(("✗ " + name));
    throw err;
  }
};

test('Awtrix#version', async () => {
  const version = await awtrix.get_version();
  // console.log(version);
});