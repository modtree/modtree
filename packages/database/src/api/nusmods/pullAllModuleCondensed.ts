import { fetchNewModuleCondensed, writeModuleCondensed } from '../../nusmods'

/** endpoint function */
async function main() {
  const modules = await fetchNewModuleCondensed()
  await writeModuleCondensed(modules)
}

main()
