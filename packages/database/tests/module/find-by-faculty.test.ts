import { container, getSource } from '../../src/data-source'
import { Module } from '../../src/entity'
import { ModuleRepository } from '../../src/repository'
import { oneUp } from '../../src/utils'
import { setup, teardown } from '../environment'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(dbName))
afterAll(() => db.destroy().then(() => teardown(dbName)))

describe('ModuleRepository.findByFaculty', () => {
  it('Valid faculty name', async () => {
    const res = await container(db, () =>
      ModuleRepository(db).findByFaculty('Computing')
    )
    if (!res) return
    expect(res).toBeInstanceOf(Array)
    res.forEach((module) => {
      expect(module).toBeInstanceOf(Module)
    })
    expect(res.length).toBeGreaterThan(100)
  })

  it('Invalid faculty name', async () => {
    const res = await container(db, () =>
      ModuleRepository(db).findByFaculty('ABCDEFGH')
    )
    if (!res) return
    expect(res).toBeInstanceOf(Array)
    expect(res.length).toBe(0)
  })
})