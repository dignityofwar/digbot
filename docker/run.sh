#!/bin/bash
### Copyright © 2018 DIG Development team. All rights reserved.

### Move into the docker image's app file we created in the docker file ###
cd app

### Final setup of dependencies ###
echo "Running npm install / prune"
npm install --only=production
npm prune

### Setup now complete, attempt to run the main JS file ###
echo "Starting DIGBot!!!"
node src/bot.js
