export const get: MethodProps = {
  method: 'Get a module condensed',
  base: 'Module Condensed',
  description: 'Retrieve basic information about one module',
  endpoint: '/moduleCondensed/moduleCode/{moduleCode}',
  requestType: 'GET',
  parameters: {
    pathParams: [
      {
        name: 'moduleCode',
        dataType: 'string',
        description: 'The code of the module.',
        required: true,
      },
    ],
  },
  response: {
    fulfilled: {
      id: 'fff52647-b948-43c3-a796-a81495d7a715',
      moduleCode: 'CS1010S',
      moduleLevel: 1010,
      title: 'Programming Methodology',
    },
    schema: {
      id: 'string',
      moduleCode: 'string',
      moduleLevel: 'number',
      title: 'string',
    },
  },
}
