#!/usr/bin/env bash
# Copyright © 2018 DIG Development team. All rights reserved.

# Hardcoded location of envConfig.json in travis build
configFile="/home/travis/build/JamesLongman/DIGBot/config/envConfig.json"

# Script arguements, takes bot token, sub-bot tokens and sub-bot IDs
token=$1
ID1=$2
ID2=$3
ID3=$4
ID4=$5
ID5=$6
ID6=$7
token1=$8
token2=$9
token3=${10}
token4=${11}
token5=${12}
token6=${13}

# Rewrite enviroment variables of envConfig.json pre tests. These lines effectively create
# and subsequently overrite 13 versions of the config file. There is most likely a much
# more efficient way of altering the config arguements to cut down on build time
# Issue #50, build time for these lines: ~26 seconds
jq -c '.token = $newVal' --arg newVal $token $configFile > tmp.$$.json && mv tmp.$$.json $configFile

jq -c '.subBots.subBot1.id = $newVal' --arg newVal $ID1 $configFile > tmp.$$.json && mv tmp.$$.json $configFile
jq -c '.subBots.subBot2.id = $newVal' --arg newVal $ID2 $configFile > tmp.$$.json && mv tmp.$$.json $configFile
jq -c '.subBots.subBot3.id = $newVal' --arg newVal $ID3 $configFile > tmp.$$.json && mv tmp.$$.json $configFile
jq -c '.subBots.subBot4.id = $newVal' --arg newVal $ID4 $configFile > tmp.$$.json && mv tmp.$$.json $configFile
jq -c '.subBots.subBot5.id = $newVal' --arg newVal $ID5 $configFile > tmp.$$.json && mv tmp.$$.json $configFile
jq -c '.subBots.subBot6.id = $newVal' --arg newVal $ID6 $configFile > tmp.$$.json && mv tmp.$$.json $configFile

jq -c '.subBots.subBot1.token = $newVal' --arg newVal $token1 $configFile > tmp.$$.json && mv tmp.$$.json $configFile
jq -c '.subBots.subBot2.token = $newVal' --arg newVal $token2 $configFile > tmp.$$.json && mv tmp.$$.json $configFile
jq -c '.subBots.subBot3.token = $newVal' --arg newVal $token3 $configFile > tmp.$$.json && mv tmp.$$.json $configFile
jq -c '.subBots.subBot4.token = $newVal' --arg newVal $token4 $configFile > tmp.$$.json && mv tmp.$$.json $configFile
jq -c '.subBots.subBot5.token = $newVal' --arg newVal $token5 $configFile > tmp.$$.json && mv tmp.$$.json $configFile
jq -c '.subBots.subBot6.token = $newVal' --arg newVal $token6 $configFile > tmp.$$.json && mv tmp.$$.json $configFile
