import { packageScriptTest } from './index.test'

const commandRegexList = ['reset*'].map((x) => new RegExp(x))

packageScriptTest(commandRegexList)
