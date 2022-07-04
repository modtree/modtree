import { setup, teardown, Repo, t } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { Degree } from '@modtree/entity'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() =>
      Repo.Degree.initialize({
        moduleCodes: [],
        title: 'Test Degree',
      })
    )
    .then((degree) => {
      t.degree = degree
      t.combinedModuleCodes = degree.modules.map(flatten.module)
    })
)
afterAll(() => teardown(db))

async function setModules(degree: Degree, moduleCodes: string[]) {
  return Repo.Degree.setModules(degree, moduleCodes)
}

it('correctly saves modules', async () => {
  await setModules(t.degree!, ['MA1521', 'MA2001', 'ST2334']).then((degree) => {
    const codes = degree.modules.map(flatten.module)
    expect(codes).toIncludeSameMembers(['MA1521', 'MA2001', 'ST2334'])
  })
})

it("doesn't add modules if all are invalid", async () => {
  await setModules(t.degree!, ['NOT_VALID']).then((degree) => {
    const codes = degree.modules.map(flatten.module)
    // no change from previous test
    expect(codes).toIncludeSameMembers([])
  })
})

it('handles mix of valid/invalid modules', async () => {
  await setModules(t.degree!, ['NOT_VALID', 'CS4269']).then((degree) => {
    const codes = degree.modules.map(flatten.module)
    expect(codes).toIncludeSameMembers(['CS4269'])
  })
})
