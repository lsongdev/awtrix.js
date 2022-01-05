#!/usr/bin/env node

const Awtrix = require('..');
const { name, version } = require('../package.json');

const { AWTRIX_API } = process.env;

const awtrix = new Awtrix({
  api: AWTRIX_API,
});

const [command, ...args] = process.argv.slice(2);

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

const commands = {
  help,
  version() {
    console.log(version);
  },
  get_settings: async () => {
    const settings = await awtrix.get_settings();
    console.log(settings);
  },
  set: async (key, value) => {
    if (!key) console.error('Missing key');
    if (!value) console.error('Missing value');
    const res = await awtrix.set(key, value);
    console.log(res);
  },
  brightness: async (value) => {
    if (!value) return console.error('brightness: missing value');
    const res = await awtrix.brightness(value);
    console.log(res);
  },
  notify: async (text) => {
    if (!text) return console.error('Missing text');
    await awtrix.notify(text);
  }
};

;(commands[command] || commands.help).apply(null, args);