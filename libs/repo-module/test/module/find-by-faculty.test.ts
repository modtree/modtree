import { Module } from '@modtree/entity'
import { setup, Repo, teardown } from '@modtree/test-env'
import { db } from '@modtree/typeorm-config'

beforeAll(() => setup(db, { restore: false }))
afterAll(() => teardown(db))

async function findByFaculty(faculty: string) {
  return Repo.Module.findByFaculty(faculty)
}

it('returns an array of modules', async () => {
  await findByFaculty('Computing').then((res) => {
    expect(res).toBeArrayOf(Module)
    expect(res.length).toBeGreaterThan(100)
  })
})

it('returns [] on invalid faculty', async () => {
  await Repo.Module.findByFaculty('NOT_VALID').then((res) => {
    expect(res).toStrictEqual([])
  })
})
