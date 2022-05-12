import { list } from '../../list'

async function main() {
  const res = await list.moduleCode()
  console.log('return value:', res)
}

main()
