import { green, red, cyan, bgGreen, bgRed, bgWhite, gray, yellow } from 'chalk'

export const log = {
  pass: (...a: any) => console.log(bgGreen.black(' PASS '), green(' ✓'), ...a),
  fail: (...a: any) => console.log(bgRed.black(' FAIL '), red(' ✗'), ...a),
  error: (...a: any) => console.log(red(...a)),
  warn: (...a: any) => console.log(yellow(...a)),
  cyan: (...a: any) => console.log(cyan(...a)),
  start: (...a: any) => console.log(bgWhite.black(' START '), ...a),
  end: (...a: any) => console.log(gray.bold('[ END ]'), gray(...a), '\n'),
  green: (...a: any) => console.log(green(...a)),
  red: (...a: any) => console.log(red(...a)),
  gray: (...a: any) => console.log(gray(...a)),
  normal: (...a: any) => console.log(...a),
}
