import { resolve } from 'path'

// hard-coded because even in dev-time, we want to use the remote
// server to read/write the runs
export const useProd = true

// paths
const rootDir = resolve(__dirname, '../../..')
const root = (p: string) => resolve(rootDir, p)

const dir = {
  root: rootDir,
  e2e: root('apps/web-e2e'),
  reporters: root('apps/web-e2e/reporters'),
  spec: root('apps/web-e2e/cypress/integration'),
  dist: root('dist/libs/cy-reporter'),
}

export const paths = {
  dir,
  executable: {
    run: root('scripts/cypress/run.js'),
    open: root('scripts/cypress/open.js'),
  },
}

export const baseURL = useProd
  ? 'https://modtree-cy-reporter.herokuapp.com'
  : 'http://localhost:8081'
