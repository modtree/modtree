import { generateSchema } from 'utils'

const fulfilled = {
  id: 'ab0b6e0d-19cc-4c2e-ad7b-7e840cb04f38',
  user: 'nguyenvukhang',
  degree: 'Mathematics',
  modulesPlaced: ['MA2001', 'MA2002'],
  modulesHidden: ['CS2040S'],
  flowNodes: [
    {
      moduleCode: 'CS1010',
      title: 'Programming Methodology',
      position: { x: 100, y: 200 },
    },
    {
      moduleCode: 'CS2030S',
      title: 'Programming Methodology II',
      position: { x: 450, y: 100 },
    },
  ],
  flowEdges: [
    {
      id: 'CS1010-CS2030S',
      source: 'CS1010',
      target: 'CS2030S',
    },
  ],
}

export const get: MethodProps = {
  method: 'Get a Graph',
  description: 'Retrieve information about one Graph',
  endpoint: '/graph/{graphId}',
  requestType: 'GET',
  parameters: {
    pathParams: [
      {
        name: 'graphId',
        dataType: 'string',
        description: 'The id of the Graph',
        required: true,
      },
    ],
  },
  response: {
    fulfilled,
    schema: generateSchema(fulfilled),
  },
}
