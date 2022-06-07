/**
 * usage:
 * nested keys will be joined with a colon.
 * keys that are "_" will simply be up until the parent.
 *
 * const scripts = {
 *   ci: {
 *     _: "echo 'hello'"
 *     build: "echo 'world'",
 *   }
 * }
 *
 * will produce these package.json scripts:
 * "scripts": {
 *   "ci": "echo 'hello'"
 *   "ci:build": "echo 'world'"
 * }
 */
const scripts = {
  script: 'node ./scripts.js',
  ci: {
    build: 'yarn lint:no-fix && yarn build && yarn build:test',
    test: {
      database: 'bash ./tests/scripts.sh database',
      server: 'bash ./tests/scripts.sh server',
      all: 'yarn ci:test:database && yarn ci:test:server',
    },
  },
  start: {
    _: 'node dist/server',
    test: 'NODE_ENV=test yarn start',
  },
  build: {
    _: 'rm -rf ./dist && tsc --build tsconfig.build.json',
    test: 'tsc --build tsconfig.test.json',
  },
  dev: {
    _: 'yarn build && yarn start',
    test: 'yarn build && yarn start:test',
  },
  graph: 'madge --image graph.png',
  default: {
    env: 'sh ./bash/setup.sh',
  },
  jest: 'NODE_ENV=test jest',
  tconf: {
    database: 'yarn jest -c ./tests/configs/database.ts',
    server: 'yarn jest -c ./tests/configs/server.ts',
    pull: 'yarn jest -c ./tests/configs/pull.ts',
    k: 'yarn jest -c ./tests/configs/k.ts',
    w: 'yarn jest -c ./tests/configs/w.ts',
    all: 'yarn jest -c ./tests/configs/all.ts',
    group: 'yarn jest -c ./tests/configs/group.ts',
  },
  test: {
    _: 'yarn tconf:group',
    database: 'yarn tconf:database',
    ci: 'yarn test:database',
    pull: 'yarn tconf:pull',
    k: 'yarn tconf:k',
    kd: 'yarn tconf:k --detectOpenHandles',
    w: 'yarn tconf:w',
    all: 'yarn tconf:all',
    s: 'yarn tconf:server',
    d: 'yarn tconf:group degree',
    m: 'yarn tconf:group module',
    mc: 'yarn tconf:group module-condensed',
    g: 'yarn tconf:group graph',
    u: 'yarn tconf:group user',
    b: 'yarn tconf:group base --silent=false',
  },
  lint: {
    _: 'eslint --fix --ext .js,.ts .',
    'no-fix': 'eslint --ext .js,.ts .',
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
  'typeorm:js': 'typeorm-ts-node-esm -d ./src/config/index.ts',
  migration: {
    check: 'yarn typeorm:js schema:log',
    generate: 'yarn typeorm:js migration:generate ./src/migrations/migration-name',
    run: 'yarn typeorm:js migration:run',
  },
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
}

function fold(tree, parents) {
  Object.keys(tree).forEach((key) => {
    const value = tree[key]
    if (typeof value === 'string') {
      const outputKey =
        key === '_' ? parents.join(':') : [...parents, key].join(':')
      output[outputKey] = value
      return
    }
    fold(tree[key], [...parents, key])
  })
  return tree
}

const fs = require('fs')
const output = {}
fold(scripts, [])
const data = JSON.parse(fs.readFileSync('package.json'))
data.scripts = output
fs.writeFileSync('package.json', JSON.stringify(data, null, 2))
