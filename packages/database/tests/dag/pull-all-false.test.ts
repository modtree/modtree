import { container, endpoint, getSource } from '../../src/data-source'
import { Init } from '../../types/modtree'
import { Degree, User, Module, DAG } from '../../src/entity'
import {
  DegreeRepository,
  UserRepository,
  DAGRepository,
} from '../../src/repository'
import { setup, importChecks, teardown } from '../environment'
import { setupDAG } from './setup'

const dbName = 'test_dag_pull_all_false'
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => teardown(dbName))

importChecks({
  entities: [Module, Degree, User, DAG],
  repositories: [UserRepository(db), DegreeRepository(db), DAGRepository(db)],
})

let degree: Degree
let user: User
let dag: DAG

beforeAll(async () => {
  await setup(dbName)
  const res = await setupDAG(db)
  if (!res) throw new Error('Unable to setup DAG test.')
  ;[user, degree] = res
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
