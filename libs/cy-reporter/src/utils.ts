import path from 'path'
import fs from 'fs'
import { green, red, cyan, bgGreen, bgRed, bgWhite, gray } from 'chalk'
import axios from 'axios'

export const client = axios.create({
  baseURL: process.env['CYPRESS_REPORTER_URL'],
})

export const log = {
  pass: (...a: any) => console.log(bgGreen.black(' PASS '), green(' ✓'), ...a),
  fail: (...a: any) => console.log(bgRed.black(' FAIL '), red(' ✗'), ...a),
  error: (...a: any) => console.log(red(...a)),
  cyan: (...a: any) => console.log(cyan(...a)),
  start: (...a: any) => console.log(bgWhite.black(' START '), ...a),
  end: (...a: any) => console.log(gray.bold('[ END ]'), gray(...a), '\n'),
  green: (...a: any) => console.log(green(...a)),
  red: (...a: any) => console.log(red(...a)),
  gray: (...a: any) => console.log(gray(...a)),
  normal: (...a: any) => console.log(...a),
}

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
