FROM node:7.6

### Add dependencies ###
RUN apt update

### Add bash script to Docker image ###
COPY docker/run.sh /app/run.sh

### Bundle source files into the Docker image's app directory ###
COPY . /app
