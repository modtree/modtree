import { ParseArgs, postman } from '../postman'

const degrees = [
  {
    moduleCodes: [
      'CS1101S',
      'CS1231S',
      'CS2030S',
      'CS2040S',
      'CS2100',
      'CS2103T',
      'CS2106',
      'CS2109S',
      'CS3230',
      'MA1521',
      'MA2001',
      'ST2334',
      'CP4101',
    ],
    title: 'Computer_Science',
  },
]

function help() {
  console.log('Please supply a degree name as an argument:')
  console.log(degrees.map((d) => d.title))
  process.exit()
}

const args = new ParseArgs(__filename, help)
const degree = degrees.find((u) => u.title === args.last)
if (!degree) help()
postman.post('degrees/', degree).then(console.log)
