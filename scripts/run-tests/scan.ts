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
  const regexMatch = fs
    .readFileSync(path, 'utf8')
    .toString()
    .match(/displayName: ?["'](.*)["'],/)
  return regexMatch ? { name: regexMatch[1], path } : { name: '', path }
}

const rootDir = path.resolve(__dirname, '../..')
const allTests = getAllFiles(rootDir, ['node_modules', 'dist'])
  .filter((f) => f.match(/jest.config.[jt]s$/))
  .map(getTestName)
  .filter((t) => t.name !== '')
  .reduce(
    (acc, cur) => ({
      ...acc,
      [cur.name]: cur.path,
    }),
    {} as Record<string, string>
  )

fs.writeFileSync(
  path.resolve(__dirname, 'tests.json'),
  JSON.stringify(allTests)
)
