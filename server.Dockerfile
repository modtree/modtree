FROM brew4k/yarn

WORKDIR /app

COPY . .

RUN yarn build

CMD ["yarn", "nx", "serve", "server"]
