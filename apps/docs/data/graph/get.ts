export const get: MethodProps = {
  method: 'Get a Graph',
  description: 'Retrieve information about one Graph.',
  endpoint: '/graph/{graphId}',
  requestType: 'GET',
  parameters: {
    pathParams: [
      {
        name: 'graphId',
        dataType: 'string',
        description: 'The id of the Graph.',
        required: true,
      },
    ],
  },
  response: {
    fulfilled: {
      id: 'ab0b6e0d-19cc-4c2e-ad7b-7e840cb04f38',
      user: 'nguyenvukhang',
      degree: 'Mathematics',
      modulesPlaced: ['MA2001', 'MA2002'],
      modulesHidden: ['CS2040S'],
    },
    schema: {
      id: 'string',
      user: 'string',
      degree: 'string',
      modulesPlaced: 'string[]',
      modulesHidden: 'string[]',
    },
  },
}
