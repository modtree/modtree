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
        'This module introduces the fundamental concepts of problem solving ' +
        'by computing and programming using an imperative programming ' +
        'language. It is the first and \nforemost introductory course to ' +
        'computing and is equivalent to CS1010 and CS1010E Programming ' +
        'Methodology. Topics covered include problem solving by computing, ' +
        'writing pseudo-codes, basic problem formulation and problem ' +
        'solving, program development, coding, testing and debugging, ' +
        'fundamental programming constructs (variables, types, expressions, ' +
        'assignments, functions, control structures, etc.), fundamental ' +
        'data structures: arrays, strings and structures, simple file ' +
        'processing, and basic recursion. This module is appropriate for ' +
        'FoS students.',
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
