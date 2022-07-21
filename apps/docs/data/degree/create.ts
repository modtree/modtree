export const create: MethodProps = {
  method: 'Create a degree',
  description: 'Create a degree',
  endpoint: '/degree/',
  requestType: 'POST',
  parameters: {
    bodyParams: [
      {
        name: 'title',
        dataType: 'string',
        description: 'Title of the degree',
        required: true,
      },
      {
        name: 'moduleCodes',
        dataType: 'string[]',
        description: 'Module codes of degree requirements',
        required: true,
      },
    ],
  },
}
