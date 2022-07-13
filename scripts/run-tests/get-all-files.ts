import fs from 'fs'
import path from 'path'

/**
 * gets all files recursively under the root provided
 */
export const getAllFiles = (root: string, ignore: string[] = []) => {
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
