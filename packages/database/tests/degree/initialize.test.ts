import { container, getSource } from '../../src/data-source'
import { Degree } from '../../src/entity'
import { init } from '../init'
import { setup, teardown, Repo, t } from '../environment'
import { flatten, oneUp } from '../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

describe('Degree.initialize', () => {
  const props = init.degree1
  it('Saves a degree', async () => {
    // write the degree to database
    await container(db, () =>
      Repo.Degree.initialize(props).then((res) => {
        expect(res).toBeInstanceOf(Degree)
        t.degree = res
      })
    )
  })

  it('Can find same degree (without relations)', async () => {
    await container(db, () =>
      Repo.Degree.findOneByTitle(props.title).then((res) => {
        expect(res).toBeInstanceOf(Degree)
        expect(res).toStrictEqual(t.degree)
      })
    )
  })

  it('Correctly saves modules', async () => {
    const moduleCodes = t.degree.modules.map(flatten.module)
    // match relation's module codes to init props' modules codes
    expect(moduleCodes.sort()).toStrictEqual(props.moduleCodes.sort())
  })
})
