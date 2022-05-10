import { fetchNewModuleCondensed, writeModuleCondensed } from '../../nusmods'

async function main() {
  const modules = await fetchNewModuleCondensed()
  await writeModuleCondensed(modules)
}

main()
