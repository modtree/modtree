import fs from 'fs'
import { join, basename } from 'path'

function getAllFiles(ignore: string[] = []) {
  process.chdir(__dirname)
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
  ls('.')
  return allFiles
}

const allFiles = getAllFiles([basename(__filename)])
const methodList = ['GET', 'POST', 'PATCH', 'DELETE']

test('all files end with `.test.ts`', () => {
  allFiles.forEach((file) => {
    expect(file.endsWith('.test.ts')).toBe(true)
  })
})

test('all tests end with [METHOD]', () => {
  allFiles.forEach((file) => {
    const name = file.replace(/\.test\.ts$/, '')
    const re = new RegExp(`.*\\[${methodList.join('|')}\\]$`)
    expect(name).toMatch(re)
  })
})
