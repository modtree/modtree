import { list } from '../../../list'
import { fetch } from '../../../nusmods'

/** endpoint function */
async function main() {
  const moduleCondensed = (await fetch.moduleCondensed()).modules
  const existingModuleCodes = await list.moduleCode()
  const newModuleCondensed = moduleCondensed.filter(
    (m) => !existingModuleCodes.has(m.moduleCode)
  )
  console.log(newModuleCondensed)
}

main()
