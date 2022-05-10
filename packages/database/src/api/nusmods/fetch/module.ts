import { listModuleCodes, listModules } from '../../../modules'
import { Module } from '../../../entity'
import { fetch, write } from '../../../nusmods'

/** endpoint function */
async function main() {
  const end = (await listModuleCodes()).size
  let d = (await listModules()).size
  while (d < end) {
    const modules: Module[] = await fetch.module(7000)
    await write.module(modules)
    d = (await listModules()).size
  }
}

main()
