import { readFileSync, writeFileSync } from 'fs'
import { getAllFiles, log } from '../utils'
import { rootDir, testJson } from './paths'

type StrRec = Record<string, string>

/**
 * @param {string} path
 */
const getTestName = (path: string): string => {
  const re = readFileSync(path, 'utf8').match(/displayName: ?["'](.*)["'],/)
  return re ? re[1] : ''
}

/**
 * scan for jest configs recursively
 */
const jestProjects = getAllFiles(rootDir, ['node_modules', 'dist'])
  .filter((path) => path.match(/jest.config.[jt]s$/))
  .map((path) => ({ path, name: getTestName(path) }))
  .filter((t) => t.name !== '')
  .reduce<StrRec>((acc, cur) => ({ ...acc, [cur.name]: cur.path }), {})

/**
 * cache them in a tests.json
 */
const current = JSON.parse(readFileSync(testJson, 'utf8'))
writeFileSync(testJson, JSON.stringify({ ...current, jestProjects }, null, 2))
log.green('Updated tests.json!')
