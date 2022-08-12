module.exports = {
  /**
   * copy the contents of file to package.json's scripts
   */
  sync: 'node scripts/sync-scripts.js',

  //  ┌────────────┐
  //  │  BUILDING  │
  //  └────────────┘

  /**
   * build modtree's core apps, which currently includes
   *  - website
   *  - server
   *  - documentation website
   */
  build: 'node .github/scripts/build-all.js',

  /**
   * build the server
   * build config → ./apps/server/webpack.js
   */
  'build:server': 'node apps/server/dev.js --build',

  /**
   * build the website
   * build config → ./apps/web/next.config.js
   */
  'build:web': 'next build apps/web',

  /**
   * build the documentation website
   * build config → ./apps/docs/next.config.js
   */
  'build:docs': 'cd apps/docs && yarn bundle && yarn build',

  //  ┌───────────────────┐
  //  │  SERVING LOCALLY  │
  //  └───────────────────┘

  /**
   * start and watch:
   *  1. the server, at http://localhost:8080
   *  2. the website, at http://localhost:3000
   */
  dev: 'node scripts/serve.js',

  /**
   * start and watch the server at http://localhost:8080
   */
  'dev:server': 'node apps/server/dev.js --watch',

  /**
   * start and watch the website at http://localhost:3000
   */
  'dev:web': 'next dev apps/web',

  /**
   * start and watch the documentation website at http://localhost:3001
   */
  'dev:docs': 'cd apps/docs && yarn bundle && yarn dev',

  //  ┌──────────────┐
  //  │  CONTAINERS  │
  //  └──────────────┘

  /**
   * start two postgresql database containers with all modules loaded
   *  1. one at localhost:4000 to serve the website
   *  2. one at localhost:4001 to serve integration tests
   */
  up: 'cd docker && docker compose --profile db up --detach',

  /**
   * stop all containers started with `yarn up`
   */
  down: 'cd docker && docker compose --profile all down',

  /**
   * build, dockerize, push, and release the modtree server
   */
  'docker:server': 'node docker/server/build.js',

  /**
   * build, dockerize, push, and release the server required for
   * `yarn cy`
   */
  'docker:cy-reporter': 'node docker/cy-reporter/build.js',

  //  ┌──────────────────────────────┐
  //  │  UNIT / INTEGRATION TESTING  │
  //  └──────────────────────────────┘

  /**
   * modtree's cli tool for running unit and integration tets
   */
  test: 'bash scripts/run-tests/run.sh',

  /**
   * scan for new test files (jest.config.ts or jest.config.js) in
   * the entire workspace, and updates ./tests.json
   */
  'test:scan': 'ts-node scripts/run-tests/scan.ts',

  /**
   * build the source code of `yarn test`
   */
  'test:build': 'yarn test:scan && node scripts/run-tests/build.js',

  //  ┌──────────────────────┐
  //  │  END-TO-END TESTING  │
  //  └──────────────────────┘

  /**
   * modtree's cli tool for running end-to-end tests
   */
  cy: 'node libs/cy-reporter/entry.js',

  /**
   * build the source code of `yarn cy`
   */
  'cy:build': 'node libs/cy-reporter/dev.js --build',

  /**
   * build and watch the source code of `yarn cy`
   */
  'cy:dev': 'node libs/cy-reporter/dev.js --watch',

  //  ┌──────────────┐
  //  │  MIGRATIONS  │
  //  └──────────────┘
  //  (more info at ./libs/migrations/README.md)

  /**
   * (migration step 0, pre-migration)
   * try to connect to a database, and check if that database is up to
   * date with the source code's schema.
   * (config → ./libs/migrations/src/config.ts)
   */
  tc: 'bash scripts/migration/test-connect.sh',

  /**
   * (migration step 1)
   * generate a *.ts file containing the commands to run for migration
   */
  mg: 'bash scripts/migration/generate.sh',

  /**
   * (migration step 2)
   * execute the migration
   */
  mr: 'bash scripts/migration/run.sh',

  //  ┌───────────────┐
  //  │  AUTOMATIONS  │
  //  └───────────────┘

  /**
   * semver bumper, for releases and auto-generating changelog since
   * last tag.
   */
  version: 'auto-changelog -p && git add --all',

  /**
   * automatically ran after `yarn` finishes running.
   */
  prepare: 'node scripts/yarn.js setup || exit 0',
}
