import { exec } from '../../src/shell'
import { getScriptsByRegex } from '../../src/yarn'
import { setup } from '../../tests/setup'

// const commandRegexList = ['reset*'].map((x) => new RegExp(x))

export function packageScriptTest(commandRegexList: RegExp[]) {
  const scripts = getScriptsByRegex({ commandRegexList }).map((x) => x.name)
  beforeEach(async () => {
    await setup()
  })

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
}
