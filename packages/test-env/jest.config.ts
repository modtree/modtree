import { Config } from '@jest/types'

const all: Config.InitialOptions = {
  rootDir: '.',
  silent: true,
  verbose: true,
  bail: 1,
  clearMocks: true,
  preset: 'ts-jest',
}

export default all
