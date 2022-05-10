import { fetchModule } from '../../nusmods'

async function main() {
  const a = await fetchModule('CS1010E')
  console.debug(a)
}

main()
