const jest = (config) => `jest -c ./tests/configs/${config}.ts --runInBand`
const yarn = {
  ci: {
    lint: 'eslint .',
    build: 'yarn ci:lint && yarn build && yarn build:test',
    restore: 'NODE_ENV=test ts-node ./tests/server/restore.ts',
    start: 'NODE_ENV=test node dist/server',
    dev: 'yarn build && yarn ci:start',
    test: {
      database: 'yarn test:database',
      server:
        'yarn ci:restore && ' +
        'yarn start-server-and-test ' +
        "'yarn ci:dev' http://localhost:8080 'yarn test:server'",
      all: 'yarn ci:test:database && yarn ci:test:server',
    },
  },
  lint: 'eslint --fix .',
  build: {
    _: 'rm -rf ./dist && tsc --build tsconfig.build.json',
    test: 'tsc --build tsconfig.test.json',
  },
  start: {
    _: 'node dist/server',
    test: 'NODE_ENV=test node dist/server',
  },
  dev: 'nodemon ./src/server/index.ts',
  test: {
    _: jest('database'),
    // narrow testing with `yarn test:database graph`
    database: jest('database'),
    server: jest('server'),
    pull: jest('pull'),
    w: jest('w'),
  },
}

const migration = {
  'typeorm:ds': 'typeorm-ts-node-esm -d ./src/config/index.ts',
  mc: 'yarn typeorm:ds schema:log',
  mg: 'yarn typeorm:ds migration:generate ./src/migrations/migration-name',
  mr: 'yarn typeorm:ds migration:run',
}

const api = {
  graph: 'madge --image graph.png',
  script: 'node ./scripts/compile-package-scripts.js',
  'default:env': 'sh ./scripts/setup.sh',
  module: {
    'get-codes': 'ts-node ./src/api/module/get-codes.ts',
    get: 'ts-node ./src/api/module/get.ts',
    pull: 'ts-node ./src/api/module/pull.ts',
    'fetch-one': 'ts-node ./src/api/module/fetch-one.ts',
    'find-by-codes': 'ts-node ./src/api/module/find-by-codes.ts',
    'find-by-faculty': 'ts-node ./src/api/module/find-by-faculty.ts',
  },
  modcon: {
    fetch: 'ts-node ./src/api/module-condensed/fetch.ts',
    pull: 'ts-node ./src/api/module-condensed/pull.ts',
    'get-codes': 'ts-node ./src/api/module-condensed/get-codes.ts',
    json: 'ts-node ./src/api/module-condensed/json.ts',
  },
  dump: 'ts-node ./src/api/sql/dump.ts',
  restore: {
    _: 'ts-node ./src/api/sql/restore.ts',
    test: 'NODE_ENV=test ts-node ./src/api/sql/restore.ts',
    'server-test': 'NODE_ENV=test ts-node ./tests/server/restore.ts',
    file: 'ts-node ./src/api/sql/restore-from-file.ts',
    default: 'ts-node ./src/api/sql/restore-default.ts',
  },
  reset: {
    all: 'ts-node ./src/api/sql/reset/all.ts',
    mc: 'ts-node ./src/api/sql/reset/moduleCondensed.ts',
    m: 'ts-node ./src/api/sql/reset/module.ts',
    d: 'ts-node ./src/api/sql/reset/degree.ts',
  },
}

module.exports = {
  ...yarn,
  ...api,
  ...migration,
}
