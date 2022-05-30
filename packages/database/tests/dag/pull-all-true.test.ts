import { container, endpoint, getSource } from '../../src/data-source'
import { Init } from '../../types/modtree'
import { Degree, User, Module, Graph } from '../../src/entity'
import {
  DegreeRepository,
  UserRepository,
  GraphRepository,
} from '../../src/repository'
import { init } from '../init'
import { setup, importChecks, teardown } from '../environment'
import { setupGraph } from './setup'

const dbName = 'test_dag_pull_all_true'
const db = getSource(dbName)
let degree: Degree
let user: User
let dag: Graph

importChecks({
  entities: [Module, Degree, User, Graph],
  repositories: [UserRepository(db), DegreeRepository(db), GraphRepository(db)],
})

beforeAll(async () => {
  await setup(dbName)
  const res = await setupGraph(db)
  if (!res) throw new Error('Unable to setup Graph test.')
  ;[user, degree] = res
})
afterAll(() => teardown(dbName))

describe('Graph.initialize', () => {
  it('Saves a dag', async () => {
    const dagProps: Init.GraphProps = {
      userId: user.id,
      degreeId: degree.id,
      modulesPlacedCodes: [],
      modulesHiddenCodes: [],
      pullAll: true,
    }
    await container(db, () => GraphRepository(db).initialize(dagProps))
    const res = await endpoint(db, () =>
      container(db, () =>
        GraphRepository(db).findManyByUserAndDegreeId(user.id, degree.id)
      )
    )
    expect(res).toBeDefined()
    if (!res) return
    const [dags, count] = res
    expect(count).toEqual(1)
    dag = dags[0]
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

describe('Graph.toggleModules', () => {
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

  it('Correctly changes a module\'s state from placed to hidden', async () => {
    await container(db, () => GraphRepository(db).toggleModule(dag, 'MA2001'))
    expect(dag.modulesPlaced.length).toEqual(moduleCodes.length - 1)
    expect(dag.modulesHidden.length).toEqual(1)
    expect(dag.modulesHidden[0].moduleCode).toEqual('MA2001')
  })

  it('Correctly changes a module\'s state from hidden to placed', async () => {
    await endpoint(db, () =>
      container(db, () => GraphRepository(db).toggleModule(dag, 'MA2001'))
    )
    expect(dag.modulesPlaced.length).toEqual(moduleCodes.length)
    expect(dag.modulesHidden.length).toEqual(0)
  })

  it('Throws error if the module to be toggled is not part of the Graph', async () => {
    let error
    await db.initialize()
    try {
      await GraphRepository(db).toggleModule(dag, init.invalidModuleCode)
    } catch (err) {
      error = err
    }
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Module not found in Graph')
    await db.destroy()
    await setup(dbName)
  })
})
