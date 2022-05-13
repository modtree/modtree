import { packageScriptTest } from './index.test'

jest.setTimeout(20000)
packageScriptTest([new RegExp('api/sql/reset*')])
