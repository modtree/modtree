import { container, endpoint, getSource } from '../src/data-source'
import { Init } from '../types/modtree'
import { Degree, User, Module, DAG } from '../src/entity'
import {
  DegreeRepository,
  UserRepository,
  DAGRepository,
} from '../src/repository'
import { init } from './init'
import { setup, importChecks, teardown } from './environment'

const dbName = 'test_dag'
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

describe('DAG.initialize with pullAll = true', () => {
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
        pullAll: true,
      }
      await container(db, () => DAGRepository(db).initialize(dagProps))
      const res = await endpoint(db, () =>
        container(db, () =>
          DAGRepository(db).find({
            where: {
              user: {
                id: user.id,
              },
              degree: {
                id: degree.id,
              },
            },
            relations: {
              user: true,
              degree: true,
              modulesPlaced: true,
              modulesHidden: true,
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

  describe('DAG.toggleModules', () => {
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
      await container(db, () => DAGRepository(db).toggleModule(dag, 'MA2001'))
      expect(dag.modulesPlaced.length).toEqual(moduleCodes.length - 1)
      expect(dag.modulesHidden.length).toEqual(1)
      expect(dag.modulesHidden[0].moduleCode).toEqual('MA2001')
    })

    it("Correctly changes a module's state from hidden to placed", async () => {
      await endpoint(db, () =>
        container(db, () => DAGRepository(db).toggleModule(dag, 'MA2001'))
      )
      expect(dag.modulesPlaced.length).toEqual(moduleCodes.length)
      expect(dag.modulesHidden.length).toEqual(0)
    })

    it('Throws error if the module to be toggled is not part of the DAG', async () => {
      let error
      await db.initialize()
      try {
        await DAGRepository(db).toggleModule(dag, init.invalidModuleCode)
      } catch (err) {
        error = err
      }
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Module not found in DAG')
      await db.destroy()
      await setup(dbName)
    })
  })
})

describe('DAG.initialize with pullAll = false', () => {
  beforeAll(() => setup(dbName))
  describe('setup DAG.initialize dependencies', () => {
    it('Saves a degree', async () => {
      await container(db, () => DegreeRepository(db).initialize(degreeProps))
      const res = await container(db, () =>
        DegreeRepository(db).findOne({
          where: {
            title: degreeProps.title,
          },
          relations: { modules: true },
        })
      )
      expect(res).toBeDefined()
      if (!res) return
      degree = res
    })

    it('Saves a user', async () => {
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
          DAGRepository(db).find({
            where: {
              user: {
                id: user.id,
              },
              degree: {
                id: degree.id,
              },
            },
            relations: {
              user: true,
              degree: true,
              modulesPlaced: true,
              modulesHidden: true,
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
})
