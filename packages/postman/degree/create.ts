import { postman } from '../postman'

const degree = {
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
  title: 'Computer Science',
}

postman.post('http://localhost:8080/degree/create', degree)
