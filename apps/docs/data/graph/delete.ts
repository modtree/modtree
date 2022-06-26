import { generateSchema } from 'utils'

const fulfilled = {
  user: 'e9f66c30-c96f-4ebd-b771-99ae8646f438',
  degree: 'fbeba80e-74bf-4a21-a6d6-b200f11a6fec',
  modulesPlaced: ['MA1521'],
  modulesHidden: ['CS2030S', 'MA2001'],
  flowNodes: [
    {
      id: 'CS1010S',
      position: {
        x: 300,
        y: -27,
      },
      data: {
        moduleCode: 'CS1010S',
        title: 'Programming Methodology',
      },
    },
    {
      id: 'CS2030S',
      position: {
        x: 80,
        y: 193,
      },
      data: {
        moduleCode: 'CS2030S',
        title: 'Programming Methodology II',
      },
    },
  ],
  flowEdges: [
    {
      id: 'CS1010S-CS2030S',
      source: 'CS1010S',
      target: 'CS2030S',
    },
  ],
}

export const deleteMethod: MethodProps = {
  method: 'Deletes a graph',
  description: 'Deletes a graph',
  endpoint: '/graph/{graphId}',
  requestType: 'DELETE',
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
  response: {
    fulfilled,
    schema: generateSchema(fulfilled),
  },
}
