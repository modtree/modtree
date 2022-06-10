import { Degree } from '@modtree/entity'
import { setup, teardown, Repo, t, init } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { container, getSource } from '@modtree/typeorm-config'
import { DegreeRepository } from '../src'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() =>
  setup(db).then(() => {
    Repo.Degree = new DegreeRepository(db)
  })
)
afterAll(() => teardown(db))

describe('Degree.initialize', () => {
  const props = init.degree1
  it('Saves a degree', async () => {
    // write the degree to database
    await container(db, () =>
      Repo.Degree!.initialize(props).then((res) => {
        expect(res).toBeInstanceOf(Degree)
        t.degree = res
      })
    )
  })

  it('Can find same degree (with relations)', async () => {
    await container(db, () =>
      Repo.Degree!.findOneByTitle(props.title).then((res) => {
        expect(res).toBeInstanceOf(Degree)
        expect(res).toStrictEqual(t.degree)
      })
    )
  })

  it('Correctly saves modules', async () => {
    const moduleCodes = t.degree!.modules.map(flatten.module)
    // match relation's module codes to init props' modules codes
    expect(moduleCodes.sort()).toStrictEqual(props.moduleCodes.sort())
  })
})
