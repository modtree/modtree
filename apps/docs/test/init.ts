export const response = {
  string: {
    title: 'Example Title',
  },
  number: {
    age: 25,
  },
  object: {
    position: {
      x: 420,
      y: 68,
    },
  },
  'string array': {
    modulesDone: ['CS1010S', 'MA2001'],
  },
  'number array': {
    workload: [3, 1, 2, 2, 2],
  },
  'object array': {
    positions: [
      {
        x: 420,
        y: 68,
      },
    ],
  },
}

export const expected = {
  string: {
    title: {
      type: 'string',
    },
  },
  number: {
    age: {
      type: 'number',
    },
  },
  object: {
    position: {
      type: 'object',
      properties: {
        x: {
          type: 'number',
        },
        y: {
          type: 'number',
        },
      },
    },
  },
  'string array': {
    modulesDone: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  'number array': {
    workload: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
  },
  'object array': {
    positions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          x: {
            type: 'number',
          },
          y: {
            type: 'number',
          },
        },
      },
    },
  },
}
