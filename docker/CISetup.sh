#!/usr/bin/env bash
# Copyright © 2018 DIG Development team. All rights reserved.

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

# Temporary fix to set the SUBBOTS and DISCORD_API_TOKEN env variables

export DISCORD_API_TOKEN=$token
export SUBBOTS="{\"subBot1\":{\"id\":\"${ID1}\",\"token\":\"${token1}\"},\"subBot2\":{\"id\":\"${ID2}\",\"token\":\"${token2}\"},\"subBot3\":{\"id\":\"${ID3}\",\"token\":\"${token3}\"},\"subBot4\":{\"id\":\"${ID4}\",\"token\":\"${token4}\"},\"subBot5\":{\"id\":\"${ID5}\",\"token\":\"${token5}\"},\"subBot6\":{\"id\":\"${ID6}\",\"token\":\"${token6}\"}}"

echo $SUBBOTS