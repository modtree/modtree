import { container, getSource } from '../../src/data-source'
import { Degree } from '../../src/entity'
import { DegreeRepository } from '../../src/repository'
import Init from '../init'
import { setup, teardown } from '../environment'
import { Flatten, oneUp } from '../../src/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const t: Partial<{ degree: Degree }> = {}

beforeAll(() => setup(dbName))
afterAll(() => db.destroy().then(() => teardown(dbName)))

describe('Degree.initialize', () => {
  const props = Init.degree1
  it('Saves a degree', async () => {
    // write the degree to database
    await container(db, () =>
      DegreeRepository(db)
        .initialize(props)
        .then((res) => {
          expect(res).toBeInstanceOf(Degree)
          t.degree = res
        })
    )
  })

  it('Correctly saves modules', async () => {
    const moduleCodes = t.degree.modules.map(Flatten.module)
    // match relation's module codes to init props' modules codes
    expect(moduleCodes.sort()).toStrictEqual(props.moduleCodes.sort())
  })
})
