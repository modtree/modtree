import { listModuleCondensed, listModules } from '../../modules'
import { Module } from '../../entity'
import { fetchSomeModule, writeModule } from '../../nusmods'

async function main() {
  let end = (await listModuleCondensed()).size
  let d = (await listModules()).size
  while (d < end) {
    const modules: Module[] = await fetchSomeModule(7000)
    await writeModule(modules)
    d = (await listModules()).size
  }
}

main()
