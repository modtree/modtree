import { container, endpoint, getSource } from '../src/data-source'
import { Degree, Module } from '../src/entity'
import { DegreeRepository } from '../src/repository'
import { Init } from '../types/modtree'
import { init } from './init'
import { setup, importChecks, teardown } from './environment'

const dbName = 'test_degree'
const db = getSource(dbName)

importChecks({
  entities: [Degree, Module],
  repositories: [DegreeRepository(db)],
})

jest.setTimeout(5000)

describe('Degree', () => {
  beforeAll(() => setup(dbName))
  afterAll(() => teardown(dbName))
  const props: Init.DegreeProps = init.degree1
  let degree: Degree

  describe('Degree.initialize', () => {
    it('Saves a degree', async () => {
      // write the degree to database
      await container(db, () => DegreeRepository(db).initialize(props))

      // retrieve that degree again
      const possiblyNull: Degree | void = await endpoint(db, () =>
        container(db, () =>
          DegreeRepository(db).findOne({
            where: {
              title: props.title,
            },
            relations: { modules: true },
          })
        )
      )
      // expect degree to be not null, not undefined
      expect(possiblyNull).toBeDefined()
      if (!possiblyNull) return
      degree = possiblyNull
    })

    it('Correctly saves modules', async () => {
      const modules: Module[] = degree.modules

      expect(modules).toBeDefined()
      if (!modules) return
      const moduleCodes = modules.map((m) => m.moduleCode)
      // match relation's module codes to init props' modules codes
      expect(moduleCodes.sort()).toStrictEqual(props.moduleCodes.sort())
      expect(moduleCodes.length).toStrictEqual(9)
    })
  })

  describe('Degree.insertModules', () => {
    const newModuleCodes = ['MA1521', 'MA2001', 'ST2334']

    it('Adds modules to a degree', async () => {
      await DegreeRepository(db).insertModules(degree, newModuleCodes)
    })

    it('Does not create a duplicate degree', async () => {
      const res = await endpoint(db, () =>
        container(db, () =>
          DegreeRepository(db).find({
            where: {
              title: props.title,
            },
            relations: { modules: true },
          })
        )
      )
      expect(res).toBeDefined()
      if (!res) return
      // Inserting modules to the degree should not create a new Degree
      expect(res.length).toEqual(1)
    })

    it('Correctly saves newly inserted modules', async () => {
      const combinedModuleCodes = props.moduleCodes.concat(newModuleCodes)

      const modules = degree.modules
      const moduleCodes = modules.map((m: Module) => m.moduleCode)

      // match retrieved module codes to
      // init props' module codes + added module codes
      expect(moduleCodes.sort()).toStrictEqual(combinedModuleCodes.sort())
      expect(moduleCodes.length).toStrictEqual(12)
    })
  })
})
