import { generateSchema } from 'utils'

const fulfilled = [
  {
    id: 'ea65f888-cde5-424e-9fa4-552ecc9ad275',
    title: 'Computer Science',
  },
  {
    id: '9e6d0a77-25ca-4a37-afb6-47f47bd702ea',
    title: 'Mathematics',
  },
]

export const list: MethodProps = {
  method: 'List all degrees',
  description: 'Retrieve information about all degrees',
  endpoint: '/degrees/',
  requestType: 'GET',
  parameters: {},
  response: {
    fulfilled,
    schema: generateSchema(fulfilled),
  },
}
