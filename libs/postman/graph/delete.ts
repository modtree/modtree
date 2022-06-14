import { ParseArgs, postman } from '../postman'

const args = new ParseArgs(__filename, () => {
  console.log('Please supply an id as an argument:')
})

postman.delete(`graph/delete/${args.last}`).then(console.log)
