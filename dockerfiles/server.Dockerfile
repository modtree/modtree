FROM node:16-alpine

WORKDIR /app

# install python
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

# Install yarn and other dependencies via apk
RUN apk add bash g++ make && rm -rf /var/cache/apk/*

# Install node dependencies - done in a separate step so Docker can cache it.
COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

# Copy project files into the docker image
COPY . /app/

RUN yarn install

CMD yarn list
