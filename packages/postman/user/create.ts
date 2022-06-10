import { postman } from '../postman'

const user1 = {
  displayName: 'Nguyen Vu Khang',
  username: 'nguyenvukhang',
  email: 'khang@modtree.com',
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
}

const user2 = {
  displayName: 'Tan Wei Seng',
  username: 'tanweiseng',
  email: 'weiseng@modtree.com',
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
}

postman.post('http://localhost:8080/user/create', user2)
