import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { Repo, setup, teardown, t } from '@modtree/test-env'
import { ModuleCondensed } from '@modtree/entity'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

async function findByCodes(moduleCodes: string[]) {
  return Repo.ModuleCondensed!.findByCodes(moduleCodes)
}

it('returns an array of condensed modules', async () => {
  await findByCodes(['MA2001', 'CS1231S', 'EL1101E']).then((modules) => {
    expect(modules).toBeArrayOf(ModuleCondensed)
    t.modulesCondensed = modules
    t.moduleCodes = modules.map(flatten.module)
  })
})

it('returns correct modules', () => {
  expect(t.moduleCodes).toIncludeSameMembers(['MA2001', 'CS1231S', 'EL1101E'])
})

it('skips invalid module codes', async () => {
  await findByCodes(['MA2001', 'NOT_VALID']).then((modules) => {
    const codes = modules.map(flatten.module)
    expect(codes).toIncludeSameMembers(['MA2001'])
  })
})

it('returns [] on only invalid codes', async () => {
  await findByCodes(['NOT_VALID']).then((modules) => {
    const codes = modules.map(flatten.module)
    expect(codes).toStrictEqual([])
  })
})
