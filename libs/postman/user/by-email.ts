import { ParseArgs, postman } from '../postman'

const args = new ParseArgs(__filename, () => {
  console.log('Please supply an email as an argument:')
  process.exit()
})

postman.post('user/get-by-email', { email: args.last }).then((res) => {
  console.log(res)
})
