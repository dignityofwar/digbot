#!/usr/bin/env bash
configFile="../config/envConfig.json";
token=$1;

# Rewrite enviroment variables
jq -c '.token = $newVal' --arg newVal $token $configFile > tmp.$$.json && mv tmp.$$.json $configFile
