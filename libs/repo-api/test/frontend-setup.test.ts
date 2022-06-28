import { getSource } from '@modtree/typeorm-config'
import { setup, Repo } from '@modtree/test-env'
import { Api } from '../src'

const dbName = 'modtree'
const db = getSource(dbName)

let api: Api

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
  })
)

test('runs with no errors', async () => {
  await expect(api.frontendSetup()).resolves.not.toThrowError()
})

test('has 3 users', async () => {
  await Repo.User.count().then((count) => {
    expect(count).toEqual(3)
  })
})

test('has 3 degrees', async () => {
  await Repo.Degree.count().then((count) => {
    expect(count).toEqual(3)
  })
})

test('has 3 graphs', async () => {
  await Repo.Graph.count().then((count) => {
    expect(count).toEqual(3)
  })
})
