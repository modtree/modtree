import { setup, teardown, Repo, t } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { DegreeRepository } from '../src'
import { Degree } from '@modtree/entity'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db)
    .then(() => {
      Repo.Degree = new DegreeRepository(db)
      return Repo.Degree!.initialize({
        moduleCodes: [],
        title: 'Test Degree',
      })
    })
    .then((degree) => {
      t.degree = degree
      t.combinedModuleCodes = degree.modules.map(flatten.module)
    })
)
afterAll(() => teardown(db))

async function insertModules(degree: Degree, moduleCodes: string[]) {
  return Repo.Degree!.insertModules(degree, moduleCodes)
}

it('correctly saves modules', async () => {
  await insertModules(t.degree!, ['MA1521', 'MA2001', 'ST2334']).then(
    (degree) => {
      const codes = degree.modules.map(flatten.module)
      expect(codes).toIncludeSameMembers(['MA1521', 'MA2001', 'ST2334'])
    }
  )
})

it("doesn't add modules if all are invalid", async () => {
  await insertModules(t.degree!, ['NOT_VALID']).then((degree) => {
    const codes = degree.modules.map(flatten.module)
    // no change from previous test
    expect(codes).toIncludeSameMembers(['MA1521', 'MA2001', 'ST2334'])
  })
})

it('handles mix of valid/invalid modules', async () => {
  await insertModules(t.degree!, ['NOT_VALID', 'CS4269']).then((degree) => {
    const codes = degree.modules.map(flatten.module)
    expect(codes).toIncludeSameMembers(['MA1521', 'MA2001', 'ST2334', 'CS4269'])
  })
})
