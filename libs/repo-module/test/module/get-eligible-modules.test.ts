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

it('returns an array of strings', async () => {
  await Repo.Module!.getEligibleModules(['CS1101S'], [], []).then((codes) => {
    expect(codes).toBeInstanceOf(Array)
    codes.forEach((e) => expect(typeof e).toBe('string'))
    t.moduleCodes = codes
  })
})

it('returns correct modules', async () => {
  expect(t.moduleCodes).toIncludeSameMembers(['CS2109S'])
})

it('returns correct modules', async () => {
  await Repo.Module!.getEligibleModules([], [], ['CS1101S']).then((codes) => {
    expect(codes).toIncludeSameMembers(['CS2109S'])
  })
})
