import { ParseArgs, postman } from '../postman'

const args = new ParseArgs(__filename, () => {
  console.debug('Please supply an id as an argument:')
})

postman.delete(`graph/${args.last}`).then(console.debug)
