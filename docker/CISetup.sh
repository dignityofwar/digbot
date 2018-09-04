#!/usr/bin/env bash
configFile=$1;
token=$2;

node > ${configFile} <<EOF
var config = require('${configFile}');

// Define environment
config.environment = 'development';

// Insert environment variables for testing
config.token = '${token}';

EOF
