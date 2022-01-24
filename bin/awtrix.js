#!/usr/bin/env node

const Awtrix = require('..');
const program = require('kelp-cli');
const { name, version } = require('../package.json');

const { AWTRIX_API } = process.env;

const awtrix = new Awtrix({
  api: AWTRIX_API,
});

const help = () => {
  console.log();
  console.log(`  ${name} ${version}`);
  console.log();
  console.log('  Usage: awtrix <command>');
  console.log();
  console.log('  Commands:');
  console.log();
  console.log('  get_settings');
  console.log('  set <key> <value>');
  console.log('  brightness <value>');
  console.log('  notify <text>');
  console.log('  draw <array>');
  console.log('  version');
  console.log();
  console.log('  Examples:');
  console.log();
  console.log('  awtrix get_settings');
  console.log('  awtrix set Brightness 50');
  console.log('  awtrix brightness 50');
  console.log('  awtrix notify "Hello World"');
  console.log();
  console.log(`  https://github.com/song940/node-awtrix`);
  console.log();
};


program()
  .command('help', help)
  .command('set', async ({ _: [key, value] }) => {
    const res = await awtrix.set(key, value);
    console.log(res);
  })
  .command('get', async ({ _: [key] }) => {
    const value = await awtrix.get(key);
    console.log(value);
  })
  .command('get_version', async () => {
    const version = await awtrix.get_version();
    console.log(version);
  })
  .command('uptime', async () => {
    const uptime = await awtrix.get_uptime();
    console.log(uptime);
  })
  .command('power', async ({ _: [state] }) => {
    const res = await awtrix.power(state === 'on');
    console.log(res);
  })
  .command('brightness', ({ _: [value] }) => {
    const res = await awtrix.brightness(value);
    console.log(res);
  })
  .command('notify', async ({ _: [message], options }) => {
    const res = await awtrix.notify(message, options);
    console.log(res);
  })
  .parse();