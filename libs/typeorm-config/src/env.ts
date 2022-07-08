import type {
  ConfigFromEnv,
  ConfigFromEnvMap,
  ConfigsFromEnv,
} from '@modtree/types'
import envMap from './env.json'

const parse = {
  boolean: (s: string | undefined): boolean => {
    return s === 'true'
  },
  number: (s: string | undefined): number => {
    if (s === undefined) return 0
    const int = parseInt(s)
    if (isNaN(int)) return 0
    return int
  },
  string: (s: string | undefined): string => {
    if (s === undefined) return ''
    return s
  },
}

const readEnv = (map: ConfigFromEnvMap): ConfigFromEnv => ({
  ssl: parse.boolean(process.env[map.ssl]),
  port: parse.number(process.env[map.port]),
  password: parse.string(process.env[map.password]),
  username: parse.string(process.env[map.username]),
  database: parse.string(process.env[map.database]),
  host: parse.string(process.env[map.host]),
})

export const env: ConfigsFromEnv = {
  test: readEnv(envMap.test),
  development: readEnv(envMap.development),
  production: readEnv(envMap.production),
  empty: envMap.empty,
}
