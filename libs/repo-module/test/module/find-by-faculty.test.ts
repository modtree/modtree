import { Module } from '@modtree/entity'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { setup, teardown, Repo } from '@modtree/test-env'
import { ModuleRepository } from '../../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.Module = new ModuleRepository(db)
  })
)
afterAll(() => teardown(db))

async function findByFaculty(faculty: string) {
  return Repo.Module!.findByFaculty(faculty)
}

it('returns an array of modules', async () => {
  await findByFaculty('Computing').then((res) => {
    expect(res).toBeArrayOf(Module)
    expect(res.length).toBeGreaterThan(100)
  })
})

it('returns [] on invalid faculty', async () => {
  await Repo.Module!.findByFaculty('NOT_VALID').then((res) => {
    expect(res).toStrictEqual([])
  })
})
