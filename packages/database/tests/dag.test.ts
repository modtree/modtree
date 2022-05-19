import { container, endpoint } from '../src/data-source'
import { setup } from './setup'

import { DAGInitProps, DegreeInitProps, UserInitProps } from '../types/modtree'
import { Degree, User, Module, DAG } from '../src/entity'
import { DegreeRepository } from '../src/repository/Degree'
import { UserRepository } from '../src/repository/User'
import { DAGRepository } from '../src/repository/DAG'

jest.setTimeout(5000)

beforeAll(async () => {
  await setup()
})

let degree: Degree, user: User, dag: DAG
let degreeProps: DegreeInitProps, userProps: UserInitProps

describe('DAG.initialize() is successful', () => {
  it('Saves a degree', async () => {
    degreeProps = {
      moduleCodes: [
        'CS1101S',
        'CS1231S',
        'CS2030S',
        'CS2040S',
        'CS2100',
        'CS2103T',
        'CS2106',
        'CS2109S',
        'CS3230',
      ],
      title: 'Computer Science',
    }
    await container(() => DegreeRepository.initialize(degreeProps))

    const res = await container(() =>
      DegreeRepository.findOne({
        where: {
          title: degreeProps.title,
        },
        relations: ['modules'],
      })
    )
    expect(res).toBeDefined()
    if (!res) return

    degree = res
  })

  it('Saves a user', async() => {
    userProps = {
      displayName: 'Nguyen Vu Khang',
      username: 'nvkhang',
      modulesDone: ['MA2001'],
      modulesDoing: ['MA2219'],
      matriculationYear: 2021,
      graduationYear: 2025,
      graduationSemester: 2,
    }
    await container(async () => {
      await UserRepository.initialize(userProps)
    })

    const res = await container(() =>
      UserRepository.findOne({
        where: {
          username: 'nvkhang',
        },
      })
    )
    expect(res).toBeDefined()
    if (!res) return

    user = res
  })

  it('Saves a dag', async() => {
    // Since modulesPlacedCodes and modulesHiddenCodes not passed in,
    // then ALL of
    // - user.modulesDoing
    // - user.modulesDone
    // - degree.modules
    // are placed modules, and no modules are hidden.

    const dagProps: DAGInitProps = {
      userId: user.id,
      degreeId: degree.id,
    }

    await container(() => DAGRepository.initialize(dagProps))

    const res = await endpoint(
      async () =>
        await container(
          async () =>
            await DAGRepository.find({
              relations: ['user', 'degree', 'modulesPlaced', 'modulesHidden'],
              where: {
                user: {
                  id: user.id
                },
                degree: {
                  id: degree.id
                },
              },
            })
        )
    )
    expect(res).toBeDefined()
    if (!res) return

    expect(res.length).toEqual(1)

    dag = res[0]
  })

  it('Correctly populates modulesPlaced', async() => {
      const moduleCodes = [
        'CS1101S',
        'CS1231S',
        'CS2030S',
        'CS2040S',
        'CS2100',
        'CS2103T',
        'CS2106',
        'CS2109S',
        'CS3230',
        'MA2001',
        'MA2219',
      ]
      const modulesPlacedCodes = dag.modulesPlaced.map((one: Module) => one.moduleCode)
      expect(moduleCodes.sort()).toEqual(modulesPlacedCodes.sort())
      expect(dag.modulesHidden.length).toEqual(0)
  })
})

describe('DAG.toggleModules()', () => {
  const moduleCodes = [
    'CS1101S',
    'CS1231S',
    'CS2030S',
    'CS2040S',
    'CS2100',
    'CS2103T',
    'CS2106',
    'CS2109S',
    'CS3230',
    'MA2001',
    'MA2219',
  ]

  it('Correctly changes a module\'s state from placed to hidden', async() => {
    await dag.toggleModule('MA2001')

    const res = await container(() =>
      DAGRepository.find({
        relations: ['user', 'degree', 'modulesPlaced', 'modulesHidden'],
        where: {
          user: {
            id: user.id
          },
          degree: {
            id: degree.id
          },
        },
      })
    )
    expect(res).toBeDefined()
    if (!res) return

    expect(res.length).toEqual(1)

    dag = res[0]

    expect(dag.modulesPlaced.length).toEqual(moduleCodes.length - 1)
    expect(dag.modulesHidden.length).toEqual(1)
    expect(dag.modulesHidden[0].moduleCode).toEqual('MA2001')
  })

  it('Correctly changes a module\'s state from hidden to placed', async() => {
    dag = await dag.toggleModule('MA2001')

    const res = await endpoint(
      async () =>
        await container(
          async () =>
            DAGRepository.find({
              relations: ['user', 'degree', 'modulesPlaced', 'modulesHidden'],
              where: {
                user: {
                  id: user.id
                },
                degree: {
                  id: degree.id
                },
              },
            })
        )
    )
    expect(res).toBeDefined()
    if (!res) return

    expect(res.length).toEqual(1)

    dag = res[0]

    expect(dag.modulesPlaced.length).toEqual(moduleCodes.length)
    expect(dag.modulesHidden.length).toEqual(0)
  })
})
