import { container, endpoint } from '../src/data-source'
import { setup } from './setup'
import { DAGInitProps } from '../types/modtree'
import { Degree, User, Module, DAG } from '../src/entity'
import {
  DegreeRepository,
  UserRepository,
  DAGRepository,
} from '../src/repository'
import { Init } from '../types/modtree'
import { init } from './init'

jest.setTimeout(5000)

beforeAll(async () => {
  await setup()
})

let degree: Degree, user: User, dag: DAG
let degreeProps: Init.DegreeProps, userProps: Init.UserProps

test('all imports are defined', () => {
  const entities = [Module, Degree, User, DAG]
  const repos = [UserRepository, DegreeRepository, DAGRepository]
  entities.forEach((e) => {
    expect(e).toBeDefined()
  })
  repos.forEach((e) => {
    expect(e).toBeDefined()
  })
})

describe('DAG.initialize() is successful', () => {
  it('Saves a degree', async () => {
    degreeProps = init.degree1

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

  it('Saves a user', async () => {
    userProps = init.user1

    await container(async () => {
      await UserRepository.initialize(userProps)
    })

    const res = await container(() =>
      UserRepository.findOne({
        where: {
          username: userProps.username,
        },
      })
    )
    expect(res).toBeDefined()
    if (!res) return

    user = res
  })

  it('Saves a dag', async () => {
    const dagProps: DAGInitProps = {
      userId: user.id,
      degreeId: degree.id,
      modulesPlacedCodes: [],
      modulesHiddenCodes: [],
      pullAll: true,
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
                  id: user.id,
                },
                degree: {
                  id: degree.id,
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

  it('Correctly populates modulesPlaced', async () => {
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
    const modulesPlacedCodes = dag.modulesPlaced.map(
      (one: Module) => one.moduleCode
    )
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

  it("Correctly changes a module's state from placed to hidden", async () => {
    await container(() => DAGRepository.toggleModule(dag, 'MA2001'))

    expect(dag.modulesPlaced.length).toEqual(moduleCodes.length - 1)
    expect(dag.modulesHidden.length).toEqual(1)
    expect(dag.modulesHidden[0].moduleCode).toEqual('MA2001')
  })

  it("Correctly changes a module's state from hidden to placed", async () => {
    await endpoint(
      async () =>
        await container(async () => DAGRepository.toggleModule(dag, 'MA2001'))
    )

    expect(dag.modulesPlaced.length).toEqual(moduleCodes.length)
    expect(dag.modulesHidden.length).toEqual(0)
  })
})

describe('DAG.initialize() with pullAll = false is empty', () => {
  beforeAll(async () => {
    await setup()
  })
  it('Saves a degree', async () => {
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

  it('Saves a user', async () => {
    await container(async () => {
      await UserRepository.initialize(userProps)
    })

    const res = await container(() =>
      UserRepository.findOne({
        where: {
          username: userProps.username,
        },
      })
    )
    expect(res).toBeDefined()
    if (!res) return

    user = res
  })

  it('Saves a dag', async () => {
    const dagProps: DAGInitProps = {
      userId: user.id,
      degreeId: degree.id,
      modulesPlacedCodes: [],
      modulesHiddenCodes: [],
      pullAll: false,
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
                  id: user.id,
                },
                degree: {
                  id: degree.id,
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

  it('modulesPlaced and modulesHidden are blank', async () => {
    expect(dag.modulesPlaced.length).toEqual(0)
    expect(dag.modulesHidden.length).toEqual(0)
  })
})
