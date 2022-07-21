export const get: MethodProps = {
  method: 'Get a module condensed',
  description: 'Retrieve basic information about one module',
  endpoint: '/module-condensed/{moduleCode}',
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
