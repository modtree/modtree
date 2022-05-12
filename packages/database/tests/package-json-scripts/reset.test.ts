import { exec } from '../../src/shell'
import { getScriptsByRegex } from '../../src/yarn'
import { setup } from '../../tests/setup'

beforeEach(async() => {
  await setup()
})

const commandRegexList = ['reset*'].map((x) => new RegExp(x))

const scripts = getScriptsByRegex({ commandRegexList }).map((x) => x.name)

test.each(scripts)(
  'check if [%s] is a valid package.json script',
  async (script) => {
    await exec(`yarn ${script}`).then((x) => {
      console.log(`done with ${script}`)
      const returnCode = x.error === null
      expect(returnCode).toStrictEqual(true)
    })
  }
)
