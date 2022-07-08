import { DegreeRepository, ModuleRepository } from '@modtree/repos'
import '@modtree/test-env/jest'
import { mocks } from '@modtree/test-env'
import mockJson from './initialize.mock.json'
import { Degree, Module } from '@modtree/types'
import { flatten } from '@modtree/utils'

let savedDegree: Degree

const props = {
  moduleCodes: ['CS1101S', 'CS1231S', 'CS2030S', 'CS2040S'],
  title: 'Test Degree',
}

const moduleRepo = new ModuleRepository(mocks.db)
const degreeRepo = new DegreeRepository(mocks.db, { module: moduleRepo })

moduleRepo.findByCodes = async (_: string[]) => {
  return new Promise((resolve) => {
    const modules = mockJson.moduleRepo.findByCodes.map((j) => {
      const m = new Module()
      Object.assign(m, j)
      return m
    })
    resolve(modules)
  })
}

degreeRepo.create = <T>(e?: T | T[]): T | T[] => {
  const degreefy = (e: T): T => {
    const d = new Degree()
    Object.assign(d, e)
    return d as unknown as T
  }
  if (e === undefined) return new Degree() as unknown as T
  if (Array.isArray(e)) {
    return e.map(degreefy)
  }
  return degreefy(e)
}
degreeRepo.save = <T>(e: T | T[]): Promise<T | T[]> => new Promise((r) => r(e))

it('returns a degree', async () => {
  await degreeRepo.initialize(props).then((res) => {
    expect(res).toBeInstanceOf(Degree)
    savedDegree = res
  })
})

it('saved the right title', () => {
  expect(savedDegree.title).toEqual(props.title)
})

it('saved the right modules', () => {
  expect(savedDegree.modules.map(flatten.module)).toIncludeSameMembers(
    props.moduleCodes
  )
})
