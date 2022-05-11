import { pull } from '../../../nusmods'

/** endpoint function */
async function main() {
  const modules = await pull.module()
  console.log(modules.length)
}

main()
