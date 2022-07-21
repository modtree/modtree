export const get: MethodProps = {
  method: 'Get a degree',
  description: 'Retrieve information about one degree',
  endpoint: '/degree/{degreeId}',
  requestType: 'GET',
  parameters: {
    pathParams: [
      {
        name: 'degreeId',
        dataType: 'string',
        description: 'The id of the degree',
        required: true,
      },
    ],
  },
}
