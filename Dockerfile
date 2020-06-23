# Copyright © 2018 DIG Development team. All rights reserved.

FROM node:10-alpine

# Install the ffmpeg binaries
#RUN apk add --no-cache ffmpeg

# Sets default values for env vars for the image
ENV NODE_ENV=development

# Create and cd into the directory where the bot will live
WORKDIR /usr/src/digbot

# Copy package & package-lock files before other files
COPY package*.json ./

# Install dependencies(dev-dependecies are not installed)
RUN apk add --no-cache --virtual .build-deps make "g++" python2 git \
    && npm ci --production \
    && apk del .build-deps

# Copies the project into the container
COPY . .

RUN cp -r ./node_modules/m3u8stream/dist ./node_modules/m3u8stream/lib

# Run the bot
CMD ["npm", "start"]
