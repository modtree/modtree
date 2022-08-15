import { resolve } from 'path'
import { readdirSync, lstatSync } from 'fs'

/**
 * gets all files recursively under the root provided
 */
export const getAllFiles = (root: string, ignore: string[] = []) => {
  const allFiles: string[] = []
  const ls = (cwd: string) => {
    readdirSync(cwd)
      .filter((x) => !ignore.includes(x))
      .forEach((f) => {
        const fp = resolve(cwd, f)
        return lstatSync(fp).isDirectory()
          ? ls(resolve(cwd, f))
          : allFiles.push(fp)
      })
  }
  ls(root)
  return allFiles
    .map((path) => path.replace(root + '/', ''))
    .filter((entry) => entry !== '')
}
