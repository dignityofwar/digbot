#!/usr/bin/env bash
configFile="/home/travis/build/JamesLongman/DIGBot/config/envConfig.json"
token=$1

# Rewrite enviroment variables
echo $configFile
jq -c '.token = $newVal' --arg newVal $token $configFile > tmp.$$.json && mv tmp.$$.json $configFile
