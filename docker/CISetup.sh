#!/usr/bin/env bash
configFile=$1;
token=$2;

node > ${configFile} <<EOF
var config = require('./${configFile}');

// Insert environment variables for testing
config.token = token;

EOF
