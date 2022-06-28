import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { getSource } from '@modtree/typeorm-config'
import { oneUp } from '@modtree/utils'
import { setup, teardown } from '@modtree/test-env'
import { Api } from '@modtree/repo-api'

const dbName = oneUp(__filename)
const db = getSource(dbName)
let app: Express
let api: Api
let findOneOrFail: jest.SpyInstance
let setMainGraph: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    findOneOrFail = jest.spyOn(api.userRepo, 'findOneOrFail')
    setMainGraph = jest.spyOn(api.userRepo, 'setMainGraph')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

async function testRequest() {
  await request(app)
    .patch('/user/924a4c06-4ccb-4208-8791-ecae4099a763/main-graph')
    .send({ graphId: 'id' })
}

test('`findOneOrFail` is called once', async () => {
  await testRequest()

  expect(findOneOrFail).toBeCalledTimes(1)
})

test('`setMainGraph` is called zero times', async () => {
  /**
   * called zero times because there is no valid user found to operate on
   */
  await testRequest()

  expect(setMainGraph).toBeCalledTimes(0)
})

test('`findOneOrFail` is called with correct args', async () => {
  await testRequest()

  expect(findOneOrFail).toBeCalledWith({
    where: { id: '924a4c06-4ccb-4208-8791-ecae4099a763' },
    relations: {
      modulesDone: true,
      modulesDoing: true,
      savedDegrees: true,
      savedGraphs: true,
      mainDegree: true,
      mainGraph: true,
    },
  })
})
