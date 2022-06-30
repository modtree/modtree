FROM node:16-alpine

WORKDIR /modtree

COPY . .

RUN yarn install

CMD yarn list
