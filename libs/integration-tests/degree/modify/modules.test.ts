import { setup, teardown, Repo, t } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'
import { InitDegreeProps, Degree } from '@modtree/types'

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

async function update(degree: Degree, props: InitDegreeProps) {
  const { title, moduleCodes } = props
  return Repo.Degree.update(degree, { title, moduleCodes })
}

it('correctly saves modules', async () => {
  const props: InitDegreeProps = {
    title: t.degree!.title,
    moduleCodes: ['MA1521', 'MA2001', 'ST2334'],
  }
  await update(t.degree!, props).then((degree) => {
    const codes = degree.modules.map(flatten.module)
    expect(codes).toIncludeSameMembers(['MA1521', 'MA2001', 'ST2334'])
  })
})

it("doesn't add modules if all are invalid", async () => {
  const props: InitDegreeProps = {
    title: t.degree!.title,
    moduleCodes: ['NOT_VALID'],
  }
  await update(t.degree!, props).then((degree) => {
    const codes = degree.modules.map(flatten.module)
    // no change from previous test
    expect(codes).toIncludeSameMembers([])
  })
})

it('handles mix of valid/invalid modules', async () => {
  const props: InitDegreeProps = {
    title: t.degree!.title,
    moduleCodes: ['NOT_VALID', 'CS4269'],
  }
  await update(t.degree!, props).then((degree) => {
    const codes = degree.modules.map(flatten.module)
    expect(codes).toIncludeSameMembers(['CS4269'])
  })
})
