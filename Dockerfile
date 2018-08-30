# Copyright © 2018 DIG Development team. All rights reserved.

FROM node:7.6

# Install bot depdencies
RUN apt update && apt install -y libav-tools

# Cleanup
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ADD docker/run.sh /usr/local/bin/run.sh
ADD docker/test.sh /usr/local/bin/test.sh
RUN chmod +x /usr/local/bin/run.sh /usr/local/bin/test.sh
