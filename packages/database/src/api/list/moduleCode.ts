import { list } from '../../list'

/** main function */
async function main() {
  const res = await list.moduleCode()
  console.log('return value:', res)
}

main()
