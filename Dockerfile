# Copyright © 2018 DIG Development team. All rights reserved.

FROM node:7.6

# Sets default values for env vars for the image
ENV NODE_ENV=development \
    DIGBOT_PORT=1337

# Create and cd into the directory where the bot will live
WORKDIR /usr/src/digbot

# Copy package & package-lock files before other files
COPY package*.json ./

# Install dependencies(dev-dependecies are not installed)
RUN npm install --only=prod

# Copies the project into the container
COPY . .

# Expose port 1337
EXPOSE 1337

# Run the bot
CMD ["npm", "start"]
