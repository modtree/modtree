export const get: MethodProps = {
  method: 'Get a graph',
  description: 'Retrieve information about one graph',
  endpoint: '/graph/{graphId}',
  requestType: 'GET',
  parameters: {
    pathParams: [
      {
        name: 'graphId',
        dataType: 'string',
        description: 'The id of the graph',
        required: true,
      },
    ],
  },
}
