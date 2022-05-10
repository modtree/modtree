import { fetchModule } from '../../nusmods'

/** endpoint function */
async function main() {
  const a = await fetchModule('CS1010E')
  console.debug(a)
}

main()
