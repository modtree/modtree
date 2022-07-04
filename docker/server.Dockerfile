FROM node:16-alpine

WORKDIR /app

# Copy project files into the docker image
COPY . .

# install python
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

# Install yarn and other dependencies via apk
RUN apk add bash g++ make && rm -rf /var/cache/apk/*

# Install node dependencies - done in a separate step so Docker can cache it.
RUN yarn install --frozen-lockfile

# the command that's ran upon `docker run`
CMD yarn serve
