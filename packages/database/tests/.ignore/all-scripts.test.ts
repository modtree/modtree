import { exec } from '../src/shell'
import { getModularScripts } from '../src/yarn'

const scripts = getModularScripts().map((x) => x.name)

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
