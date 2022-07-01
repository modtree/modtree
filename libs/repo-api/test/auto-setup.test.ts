import { getSource } from '@modtree/typeorm-config'
import { setup, Repo } from '@modtree/test-env'
import { Api } from '../src'
import '@modtree/test-env/jest'

const dbName = 'modtree'
const db = getSource(dbName)

let api: Api

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
  })
)

test('runs with no errors', async () => {
  await expect(api.autoSetup()).resolves.not.toThrowError()
})

test('has 2 users', async () => {
  await Repo.User.count().then((count) => {
    expect(count).toEqual(2)
  })
})

test('has 2 degrees', async () => {
  await Repo.Degree.count().then((count) => {
    expect(count).toEqual(2)
  })
})

test('has 2 graphs', async () => {
  await Repo.Graph.count().then((count) => {
    expect(count).toEqual(2)
  })
})
