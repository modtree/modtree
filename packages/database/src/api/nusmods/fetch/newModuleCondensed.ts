import { listModuleCodes } from '../../../modules'
import { fetch } from '../../../nusmods'

/** endpoint function */
async function main() {
  const moduleCondensed = (await fetch.moduleCondensed()).modules
  const existingModuleCodes = await listModuleCodes()
  const newModuleCondensed = moduleCondensed.filter(m => !existingModuleCodes.has(m.moduleCode))
  console.log(newModuleCondensed)
}

main()
