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
    expect(count).toBe(3)
  })
})
