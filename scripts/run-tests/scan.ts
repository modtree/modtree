import path from 'path'
import fs from 'fs'
import { getAllFiles } from './get-all-files'

const outFile = path.resolve(__dirname, 'tests.json')

/**
 * @param {string} path
 */
const getTestName = (path: string): string => {
  const re = fs
    .readFileSync(path, 'utf8')
    .toString()
    .match(/displayName: ?["'](.*)["'],/)
  return re ? re[1] : ''
}

const rootDir = path.resolve(__dirname, '../..')

/**
 * scan for jest configs recursively
 */
const jestProjects = getAllFiles(rootDir, ['node_modules', 'dist'])
  .filter((path) => path.match(/jest.config.[jt]s$/))
  .map((path) => ({ path, name: getTestName(path) }))
  .filter((t) => t.name !== '')
  .reduce((acc, cur) => ({ ...acc, [cur.name]: cur.path }), {})

/**
 * cache them in a tests.json
 */
const current = JSON.parse(fs.readFileSync(outFile, 'utf8'))
fs.writeFileSync(outFile, JSON.stringify({ ...current, jestProjects }, null, 2))
