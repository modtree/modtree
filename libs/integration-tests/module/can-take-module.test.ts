import { setup, Repo, teardown } from '@modtree/test-env'
import { testDb } from '@modtree/typeorm-config'

beforeAll(() => setup(testDb, { restore: false }))
afterAll(() => teardown(testDb))

async function canTakeModule(done: string[], doing: string[], query: string) {
  return Repo.Module.canTakeModule(done, doing, query)
}

it('returns correct results', async () => {
  const modulesTested = ['MA2101', 'MA1100', 'CS2040S', 'CS1010S']
  await Promise.all(
    modulesTested.map((x) => canTakeModule(['MA2001'], ['MA2219'], x))
  ).then((res) => {
    expect(res).toStrictEqual([true, false, false, true])
  })
})

it('returns false for modules done', async () => {
  await canTakeModule(['MA2001'], [], 'MA2001').then((res) =>
    expect(res).toBe(false)
  )
})

it('returns false for modules doing', async () => {
  await canTakeModule([], ['MA2001'], 'MA2001').then((res) =>
    expect(res).toBe(false)
  )
})

it('Rejects invalid module code', async () => {
  await canTakeModule(['CM1102'], ['CS1010'], 'NOT_VALID').then((res) => {
    expect(res).toBe(false)
  })
})
