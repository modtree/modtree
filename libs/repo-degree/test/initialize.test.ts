import { Degree } from '@modtree/entity'
import { setup, teardown, Repo, t } from '@modtree/test-env'
import { flatten, oneUp } from '@modtree/utils'
import { getSource } from '@modtree/typeorm-config'

const dbName = oneUp(__filename)
const db = getSource(dbName)

beforeAll(() => setup(db))
afterAll(() => teardown(db))

const props = {
  moduleCodes: [
    'CS1101S',
    'CS1231S',
    'CS2030S',
    'CS2040S',
    'CS2100',
    'CS2103T',
    'CS2106',
    'CS2109S',
    'CS3230',
  ],
  title: 'Test Degree',
}

it('initial count', async () => {
  await Repo.Degree!.count().then((count) => {
    expect(count).toEqual(0)
  })
})

it('returns a degree', async () => {
  await Repo.Degree!.initialize(props).then((res) => {
    expect(res).toBeInstanceOf(Degree)
    t.degree = res
  })
})

it('increments the count by 1', async () => {
  await Repo.Degree!.count().then((count) => {
    expect(count).toEqual(1)
  })
})

it('saves correct modules', async () => {
  const codes = t.degree!.modules.map(flatten.module)
  expect(codes).toIncludeSameMembers(props.moduleCodes)
})
