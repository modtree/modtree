export const get: MethodProps = {
  method: 'Get a module',
  description: 'Retrieve full information about one module',
  endpoint: '/module/{moduleCode}',
  requestType: 'GET',
  parameters: {
    pathParams: [
      {
        name: 'moduleCode',
        dataType: 'string',
        description: 'The code of the module',
        required: true,
      },
    ],
  },
}
