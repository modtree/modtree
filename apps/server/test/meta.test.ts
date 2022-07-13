import fs from 'fs'
import { join, basename } from 'path'
import { routes } from '../src/routes'
import '@modtree/test-env/jest'

function getAllFiles(ignore: string[] = []) {
  const allFiles: string[] = []
  const ls = (cwd: string) => {
    fs.readdirSync(cwd)
      .filter((x) => !ignore.includes(x))
      .forEach((file) => {
        const filepath = join(cwd, file)
        if (fs.lstatSync(filepath).isDirectory()) {
          ls(join(cwd, file))
        } else {
          allFiles.push(filepath)
        }
      })
  }
  ls(__dirname)
  return allFiles
    .map((path) => path.replace(__dirname, ''))
    .filter((entry) => entry !== '')
}

const allFiles = getAllFiles([basename(__filename)])
const apiRoutes = routes.map(({ route, method }) => ({ route, method }))
const fileRoutes = allFiles
  .map((filepath) => {
    const [route, method] = filepath
      .replace(/(.*)\/(GET|POST|PATCH|DELETE)\.test\.ts/, '$1___$2')
      .split('___')
    return { route, method: method.toLowerCase() }
  })
  .filter((f) => f.route !== '')

test('all files end with `.test.ts`', () => {
  allFiles.forEach((file) => {
    expect(file.endsWith('.test.ts')).toBe(true)
  })
})

test('all filenames are [METHOD]', () => {
  allFiles.forEach((file) => {
    expect(basename(file)).toMatch(/^(GET|POST|PATCH|DELETE)\.test\.ts$/)
  })
})

test("routes don't end with /", () => {
  apiRoutes.forEach(({ route }) => {
    expect(route[route.length - 1]).not.toBe('/')
  })
})

test('all routes have a test', () => {
  apiRoutes.forEach(({ route, method }) => {
    expect(fileRoutes).toContainEqual({ route, method })
  })
})

test('no extra tests exists', () => {
  fileRoutes.forEach(({ route, method }) => {
    expect(apiRoutes).toContainEqual({ route, method })
  })
  const rootDir = join(__dirname, '../../..')
  const sortedRoutes = apiRoutes.sort((a, b) => (a.route < b.route ? -1 : 1))
  const json = JSON.stringify(sortedRoutes, null, 2)
  fs.writeFileSync(join(rootDir, 'references/routes.json'), json)
})
