#!/bin/bash

cd /var/project
echo "Running npm install / prune"
npm install
npm prune
echo "Running tests..."
npm test
