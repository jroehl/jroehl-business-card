#!/usr/bin/env node
'use strict';
console.log(require('fs').readFileSync(require('path').join(__dirname, 'output'), 'utf8'));
