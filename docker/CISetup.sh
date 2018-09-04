#!/usr/bin/env bash
configFile=$1;

node > out_${configFile} <<EOF
//Read data
var config = require('./${configFile}');

//Manipulate data

//Output data
constole.log("====TEST LOG====")
console.log(config.environment);

EOF
