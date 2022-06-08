import { container, getSource } from '@src/data-source'
import { Module } from '@entity'
import { oneUp } from '@utils'
import { setup, teardown, Repo } from '@environment'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

describe('ModuleRepository.findByFaculty', () => {
  it('Valid faculty name', async () => {
    const res = await container(db, () =>
      Repo.Module.findByFaculty('Computing')
    )
    if (!res) return
    expect(res).toBeInstanceOf(Array)
    res.forEach((module) => {
      expect(module).toBeInstanceOf(Module)
    })
    expect(res.length).toBeGreaterThan(100)
  })

  it('Invalid faculty name', async () => {
    const res = await container(db, () => Repo.Module.findByFaculty('ABCDEFGH'))
    if (!res) return
    expect(res).toBeInstanceOf(Array)
    expect(res.length).toBe(0)
  })
})
