'use strict';

const chalk = require('chalk');
const boxen = require('boxen');
const fs = require('fs');
const path = require('path');
const { content, separator, padding } = require('./config');

const mergedData = {
  heading: {
    label: content.name,
    separator,
    content: content.website,
  },
  twitter: {
    label: 'twitter',
    separator,
    content: `https://twitter.com/${content.twitter}`,
  },
  github: {
    label: 'github',
    separator,
    content: `https://github.com/${content.github}`,
  },
  linkedin: {
    label: 'linkedin',
    separator,
    content: `https://linkedin.com/in/${content.linkedin}`,
  },
  web: {
    label: 'web',
    separator,
    content: content.website,
  },
  card: {
    label: 'card',
    separator,
    content: `npx ${content.npx}`,
  },
};

const maxWidth = Object.values(mergedData).reduce((red, data) => {
  const width =
    Object.keys(data)
      .reduce((red, key) => (data[key] ? [...red, data[key]] : red), [])
      .join(' ').length +
    padding * 2;
  return width > red ? width : red;
}, 0);

/**
 * Generate line with correct measurements
 * @param {string} key
 * @param {object} [colors={}]
 */
const genLine = (key, colors = {}) => {
  let line = '\n';
  if (!key) {
    line = `${' '.repeat(maxWidth)}\n`;
  } else if (key) {
    const data = mergedData[key];
    const { label = '', separator = '' } = data;
    const keys = Object.keys(data);

    const parts = keys.reduce(
      (red, key) => (data[key] ? [...red, data[key]] : red),
      []
    );

    const prefix = ' '.repeat(
      (maxWidth - padding) / 3 - label.length - separator.length
    );

    const colored = keys.reduce(
      (red, key) =>
        data[key] ? [...red, chalk[colors[key] || 'white'](data[key])] : red,
      []
    );

    const string = `${prefix}${colored.join(' ')}`;

    line = `${string}${' '.repeat(
      maxWidth - prefix.length - parts.join(' ').length
    )}\n`;
  }

  return colors.bg ? chalk[colors.bg](line) : line;
};

const output =
  genLine() +
  genLine(undefined, { bg: 'bgWhite' }) +
  genLine('heading', {
    bg: 'bgWhite',
    label: 'black',
    content: 'black',
    separator: 'magenta',
  }) +
  genLine(undefined, { bg: 'bgWhite' }) +
  genLine() +
  genLine('twitter', { separator: 'magenta', label: 'grey' }) +
  genLine('github', { separator: 'magenta', label: 'grey' }) +
  genLine('linkedin', { separator: 'magenta', label: 'grey' }) +
  genLine() +
  genLine('web', { separator: 'magenta', label: 'grey' }) +
  genLine('card', { separator: 'magenta', label: 'grey' });

fs.writeFileSync(
  path.join(__dirname, 'bin/output'),
  chalk.magenta(boxen(output, { borderStyle: 'round' }))
);
