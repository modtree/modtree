export const list: MethodProps = {
  method: 'List many modules condensed',
  description: 'Retrieve basic information about many modules',
  endpoint: '/modules-condensed/',
  requestType: 'GET',
  parameters: {
    queryParams: [
      {
        name: 'moduleCodes',
        dataType: 'string[]',
        description:
          'An array of module codes. Leave empty to retrieve all modules condensed.',
        required: false,
      },
    ],
  },
}
