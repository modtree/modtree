import { fetch, write } from '../../../nusmods'

/** endpoint function */
async function main() {
  const { modules } = await fetch.moduleCondensed()
  console.log(modules)
  await write.moduleCondensed(modules)
}

main()
