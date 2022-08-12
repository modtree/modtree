/**
 * Some clutch assistance for dotenv to ensure that the env is read.
 * Meant to be imported as a file.
 */
import { resolve } from 'path'
import { config } from 'dotenv'

// this is relative to the output directory,
// namely apps/web-e2e/reporters
config({ path: resolve(__dirname, '../../../.env') })

// hard-coded because even in dev-time, we want to use the remote
// server to read/write the runs
export const useProd = true
export const baseURL = useProd
  ? 'https://modtree-cy-reporter.herokuapp.com'
  : 'http://localhost:8081'
