#!/bin/bash
cd /var/project
npm install
npm prune
node src/bot.js
