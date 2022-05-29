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
        description: 'The code of the module.',
        required: true,
      },
    ],
  },
  response: {
    fulfilled: {
      id: 'fff52647-b948-43c3-a796-a81495d7a715',
      moduleCode: 'CS1010S',
      title: 'Programming Methodology',
      acadYear: '2021/2022',
      description:
        'This module is a first course in linear algebra. Fundamental ' +
        'concepts of linear algebra will be introduced and investigated in ' +
        'the context of the Euclidean spaces R^n.  Proofs of results will ' +
        'be presented in the concrete setting.  Students are expected to ' +
        'acquire computational facilities and geometric intuition with ' +
        'regard to vectors and matrices.  Some applications will be ' +
        'presented. Major topics: Systems of linear equations, matrices, ' +
        'determinants, Euclidean spaces, linear combinations and linear ' +
        'span, subspaces, linear independence, bases and dimension, rank of ' +
        'a matrix, inner products, eigenvalues and eigenvectors, ' +
        'diagonalization, linear transformations between Euclidean spaces, ' +
        'applications.',
      moduleCredit: 4,
      department: 'Computer Science',
      faculty: 'Computing',
      prerequisite: '',
      corequisite: '',
      preclusion: 'CS1010, CS1010E, CS1010J, CS1010X, CS1010XCP, CS1101S',
      fulfillRequirements: [
        'FIN4124',
        'FIN4719',
        'IT3010',
        'ZB4171',
        'MA3269',
        'DSA3102',
        'ST3247',
        'QF2103',
      ],
      prereqTree: '',
      workload: [2, 1, 1, 3, 3],
    },
    schema: {
      id: 'string',
      moduleCode: 'string',
      title: 'string',
      acadYear: 'string',
      description: 'string',
      moduleCredit: 'number',
      department: 'string',
      faculty: 'string',
      prerequisite: 'string',
      corequisite: 'string',
      preclusion: 'string',
      fulfillRequirements: 'string[]',
      prereqTree: 'json-tree',
      workload: 'number[]',
    },
  },
}
