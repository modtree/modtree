const fulfilled = {
  id: 'e9f66c30-c96f-4ebd-b771-99ae8646f438',
  authZeroId: 'auth0|something',
  displayName: 'Tan Wei Seng',
  username: 'weiseng',
  email: 'tanweiseng18@gmail.com',
  matriculationYear: 2021,
  graduationYear: 2024,
  graduationSemester: 2,
  modulesDone: [
    {
      id: '89a13cc2-5daf-47c1-a35f-7352929615e8',
      acadYear: '2021/2022',
      moduleCode: 'CS2106',
      title: 'Introduction to Operating Systems',
      description:
        'This module introduces the basic concepts in operating systems and links it with contemporary operating systems (eg. Unix/Linux and Windows). It focuses on OS structuring and architecture, processes, memory management, concurrency and file systems. Topics include kernel architecture, system calls, interrupts, models of processes, process abstraction and services, scheduling, review of physical memory and memory management hardware, kernel memory management, virtual memory and paging, caches, working set, deadlock, mutual exclusion, synchronisation mechanisms, data and metadata in file systems, directories and structure, file system abstraction and operations, OS protection mechanisms, and user authentication.',
      moduleCredit: '4',
      department: 'Computer Science',
      faculty: 'Computing',
      aliases: '',
      attributes: '[Object]',
      prerequisite: 'CS2100 or EE2007 or EE2024 or EE2028',
      corequisite: '',
      preclusion:
        'CG2271 or EE4214. CEG students are not allowed to take this module.',
      fulfillRequirements: '[Array]',
      semesterData: '[Array]',
      prereqTree: '[Object]',
      workload: '[Array]',
    },
  ],
  modulesDoing: [
    {
      id: '26aefe3a-cc8d-4d12-83b7-86b31bcbae5d',
      acadYear: '2021/2022',
      moduleCode: 'PC1201',
      title: 'Fundamentals of Physics',
      description:
        'This module aims to bridge the gap between ‘O’-level physics and first-year-level university physics. The module covers two branches of fundamental physics: mechanics and electricity & magnetism. Topics included in mechanics are linear motion, circular motion, Newton’s laws of motion, work and energy, conservation of energy, linear momentum, and simple harmonic motion. Topics included in electricity & magnetism are electric force, field & potential, current & resistance, DC circuits, electromagnetism and electromagnetic induction.',
      moduleCredit: '4',
      department: 'Physics',
      faculty: 'Science',
      aliases: '',
      attributes: '[Object]',
      prerequisite:
        '‘O’-level pass in Physics or Combined Science (Physics & Chemistry OR Physics & Biology).',
      corequisite: '',
      preclusion:
        "'A' Level or H2 Pass in Physics or PC1221/PC1221X/PC1221FC or PC1222/PC1222X or PC1141 or PC1142 or PC1143 or PC1144 or PC1431/PC1431X or PC1432/PC1432X.",
      fulfillRequirements: '[Array]',
      semesterData: '[Array]',
      prereqTree: '',
      workload: '[Array]',
    },
  ],
  savedDegrees: [
    {
      id: 'd44ff19f-c054-43a2-93bb-ee94e87b68f5',
      title: 'Computer_Science',
      modules: '[Array]',
    },
    {
      id: 'f2b8d3e1-1907-4d60-82ee-cef57b510b9e',
      title: 'Computer_Science',
      modules: '[Array]',
    },
  ],
  savedGraphs: [
    {
      user: '66279355-a737-4e04-89af-54a8c5e93c6a',
      degree: 'bc632a53-e034-4c74-bb3c-192b190668ff',
      modulesPlaced: '[Object]',
      modulesHidden: '[Object]',
      id: '0231b718-d33b-44b8-8d3f-a808e86bfe62',
      flowNodes: '[Object]',
      flowEdges: '[Object]',
    },
  ],
}

export const getFull: MethodProps = {
  method: 'Get a full user',
  description: 'Retrieve information about one user, including relations',
  endpoint: '/user/{userId}/get-full',
  requestType: 'GET',
  parameters: {
    pathParams: [
      {
        name: 'userId',
        dataType: 'string',
        description: 'The id of the user',
        required: true,
      },
    ],
  },
  response: {
    fulfilled,
  },
}
