import { getAllFiles } from '../utils'
import { basename } from 'path'
import ROUTES from './routes.json'

const TEST_DIR = __dirname + '/api'
const ALL_FILES = getAllFiles(TEST_DIR, [basename(__filename)])
const fileRoutes = ALL_FILES.map((filepath) => {
  const [path, method] = filepath
    .replace(/(.*)\/(GET|POST|PATCH|DELETE)\.test\.ts/, '$1___$2')
    .split('___')
  return { path: '/' + path, method }
}).filter((f) => f.path !== '')

test('all files end with `.test.ts`', () => {
  ALL_FILES.forEach((file) => {
    expect(file.endsWith('.test.ts')).toBe(true)
  })
})

test("routes don't end with /", () => {
  ROUTES.forEach(({ path }) => {
    expect(path[path.length - 1]).not.toBe('/')
  })
})

test('all routes have a test', () => {
  ROUTES.forEach(({ path, method }) => {
    expect(fileRoutes).toContainEqual({ path, method })
  })
})

test('no extra tests exist', () => {
  fileRoutes.forEach(({ path, method }) => {
    expect(ROUTES).toContainEqual({ path, method })
  })
})
