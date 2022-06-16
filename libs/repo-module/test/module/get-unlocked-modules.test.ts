import { setup, teardown, Repo, t } from '@modtree/test-env'
import { oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { ModuleRepository } from '../../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.Module = new ModuleRepository(db)
  })
)
afterAll(() => teardown(db))

async function getUnlockedModules(
  done: string[],
  doing: string[],
  query: string
) {
  return Repo.Module!.getUnlockedModules(done, doing, query)
}

it('returns an array of strings', async () => {
  await getUnlockedModules(['CS1010'], [], 'CS2100').then((codes) => {
    codes.forEach((e) => expect(typeof e).toBe('string'))
    t.moduleCodes = codes
  })
})

it('returns correct modules', async () => {
  expect(t.moduleCodes).toIncludeSameMembers(['CS2106', 'CS3210', 'CS3237'])
})

it('returns [] if if already done', async () => {
  await getUnlockedModules(['CS1010'], [], 'CS1010').then((modules) => {
    expect(modules).toStrictEqual([])
  })
})
