import { getSource } from '@src/data-source'
import { Module } from '@modtree/entity'
import { oneUp } from '@utils'
import { setup, teardown, Repo } from '@environment'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

describe('ModuleRepository.findByFaculty', () => {
  it('Valid faculty name', async () => {
    expect.hasAssertions()
    await Repo.Module.findByFaculty('Computing').then((res) => {
      expect(res).toBeInstanceOf(Array)
      res.forEach((module) => {
        expect(module).toBeInstanceOf(Module)
      })
      expect(res.length).toBeGreaterThan(100)
    })
  })

  it('Invalid faculty name', async () => {
    expect.hasAssertions()
    await Repo.Module.findByFaculty('ABCDEFGH').then((res) => {
      expect(res).toBeInstanceOf(Array)
      expect(res.length).toBe(0)
    })
  })
})
