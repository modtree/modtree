import { container, endpoint, getSource } from '../../src/data-source'
import { Init } from '../../types/modtree'
import { Degree, User, Module, DAG } from '../../src/entity'
import {
  DegreeRepository,
  UserRepository,
  DAGRepository,
} from '../../src/repository'
import { init } from '../init'
import { setup, importChecks, teardown } from '../environment'

const dbName = 'test_dag_pull_all_false'
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => teardown(dbName))

importChecks({
  entities: [Module, Degree, User, DAG],
  repositories: [UserRepository(db), DegreeRepository(db), DAGRepository(db)],
})

jest.setTimeout(5000)

let degree: Degree
let user: User
let dag: DAG
let degreeProps: Init.DegreeProps
let userProps: Init.UserProps

beforeAll(() => setup(dbName))
describe('setup DAG.initialize dependencies', () => {
  it('Saves a degree', async () => {
    degreeProps = init.degree1
    await container(db, () => DegreeRepository(db).initialize(degreeProps))
    const res = await container(db, () =>
      DegreeRepository(db).findOneByTitle(degreeProps.title)
    )
    expect(res).toBeDefined()
    if (!res) return
    degree = res
  })

  it('Saves a user', async () => {
    userProps = init.user1
    await container(db, async () => {
      await UserRepository(db).initialize(userProps)
    })
    const res = await container(db, () =>
      UserRepository(db).findOneByUsername(userProps.username)
    )
    expect(res).toBeDefined()
    if (!res) return
    user = res
  })
})

describe('DAG.initialize', () => {
  it('Saves a dag', async () => {
    const dagProps: Init.DAGProps = {
      userId: user.id,
      degreeId: degree.id,
      modulesPlacedCodes: [],
      modulesHiddenCodes: [],
      pullAll: false,
    }
    await container(db, () => DAGRepository(db).initialize(dagProps))
    const res = await endpoint(db, () =>
      container(db, () =>
        DAGRepository(db).findOneByUserAndDegreeId(user.id, degree.id)
      )
    )
    expect(res).toBeDefined()
    if (!res) return
    dag = res
  })

  it('modulesPlaced and modulesHidden are blank', async () => {
    expect(dag.modulesPlaced.length).toEqual(0)
    expect(dag.modulesHidden.length).toEqual(0)
  })
})
