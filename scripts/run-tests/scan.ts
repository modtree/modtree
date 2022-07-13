import path from 'path'
import fs from 'fs'
import { getAllFiles } from './get-all-files'

type Test = {
  name: string
  path: string
}

/**
 * @param {string} path
 * @returns {Test} test display name
 */
const getTestName = (path: string): Test => {
  const output = {
    path,
    name: '',
  }
  const regexMatch = fs
    .readFileSync(path, 'utf8')
    .toString()
    .match(/displayName: ?["'](.*)["'],/)
  return regexMatch ? { ...output, name: regexMatch[1] } : output
}

const rootDir = path.resolve(__dirname, '../..')
const allTestNames = getAllFiles(rootDir, ['node_modules', 'dist'])
  .filter((f) => f.match(/jest.config.[jt]s$/))
  .map(getTestName)
  .filter((t) => t.name !== '')

console.log(allTestNames)
