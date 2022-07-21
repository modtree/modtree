import { Degree } from '@modtree/types'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

it('initial count', async () => {
  await Repo.Degree.count().then((count) => {
    expect(count).toEqual(0)
  })
})

it('returns a degree', async () => {
  await Repo.Degree.initialize(
    init.degree1.title,
    init.degree1.moduleCodes
  ).then((res) => {
    expect(res).toBeInstanceOf(Degree)
    t.degree = res
  })
})

it('increments the count by 1', async () => {
  await Repo.Degree.count().then((count) => {
    expect(count).toEqual(1)
  })
})

it('saves correct modules', async () => {
  const codes = t.degree!.modules.map(flatten.module)
  expect(codes).toIncludeSameMembers(init.degree1.moduleCodes)
})
