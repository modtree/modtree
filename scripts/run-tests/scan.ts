import path from 'path'
import fs from 'fs'

/**
 * gets all files recursively under the root provided
 */
const getAllFiles = (root: string, ignore: string[] = []) => {
  const allFiles: string[] = []
  const ls = (cwd: string) => {
    fs.readdirSync(cwd)
      .filter((x) => !ignore.includes(x))
      .forEach((file) => {
        const filepath = path.resolve(cwd, file)
        if (fs.lstatSync(filepath).isDirectory()) {
          ls(path.resolve(cwd, file))
        } else {
          allFiles.push(filepath)
        }
      })
  }
  ls(root)
  return allFiles
    .map((path) => path.replace(root + '/', ''))
    .filter((entry) => entry !== '')
}

const rootDir = path.resolve(__dirname, '../..')
const outFile = path.resolve(rootDir, 'tests.json')

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
