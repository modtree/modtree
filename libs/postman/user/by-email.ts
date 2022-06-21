import { ParseArgs, postman } from '../postman'

const args = new ParseArgs(__filename, () => {
  console.log('Please supply an email as an argument:')
  process.exit()
})

postman
  .post('users/get-by-primary-keys', { email: args.last })
  .then(console.log)

// console.log(res.response.data.errors)
