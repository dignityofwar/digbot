#!/usr/bin/env bash
configFile=$1;
token=$2;

# Rewrite enviroment variables
jq -c '.token = $token' configFile > tmp.$$.json && mv tmp.$$.json configFile
