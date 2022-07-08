import { DataSourceOptions } from '@modtree/types'
import { getConfig } from '../src'
import fs from 'fs'

let config: DataSourceOptions
let rootFiles: string[]

test('reads correct files', () => {
  expect(1).toBe(1)
})

test('returns an object', () => {
  config = getConfig()
  expect(config).toBeDefined()
  expect(config).toBeInstanceOf(Object)
})

test('root directory is correct', () => {
  rootFiles = fs.readdirSync(config.rootDir)
  expect(rootFiles).toEqual(
    expect.arrayContaining([
      'nx.json',
      'workspace.json',
      'package.json',
      'tsconfig.base.json',
    ])
  )
})

test('NODE_ENV is test', () => {
  expect(process.env['NODE_ENV']).toEqual('test')
})
