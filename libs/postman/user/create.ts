import { ParseArgs, postman } from '../postman'

const users = [
  {
    displayName: 'Nguyen Vu Khang',
    username: 'khang',
    email: 'brew4k@gmail.com',
    authZeroId: 'auth0|khang',
    modulesDone: [
      'MA2001,',
      'MA1100,',
      'HSH1000,',
      'HSA1000,',
      'GEA1000',
      'IS1103',
      'CS1010S',
      'DTK1234',
      'HS1401S',
      'HSI1000',
      'HSS1000',
      'MA2002',
      'MA2219',
      'PC1432',
    ],
    modulesDoing: [],
    matriculationYear: 2021,
    graduationYear: 2024,
    graduationSemester: 2,
  },
  {
    displayName: 'Tan Wei Seng',
    username: 'weiseng',
    email: 'tanweiseng18@gmail.com',
    authZeroId: 'auth0|weiseng',
    modulesDone: [
      'MA1521',
      'MA2001',
      'CS1231S',
      'CS2100',
      'CS2030S',
      'IS1103',
      'CS2040S',
      'CS2106',
      'MA2101',
      'PC1201',
      'ES2660',
      'ST1131',
      'EL1101E',
      'LAJ2203',
    ],
    modulesDoing: [],
    matriculationYear: 2021,
    graduationYear: 2024,
    graduationSemester: 2,
  },
  {
    username: 'base',
    email: 'base@modtree.com',
    authZeroId: 'auth0|base',
  },
]

function help() {
  console.log('Please supply a username as an argument:')
  console.log(users.map((u) => u.username))
  process.exit()
}

const args = new ParseArgs(__filename, help)
const user = users.find((u) => u.username === args.last)
if (!user) help()
postman.post('user/create', user).then(console.log)
