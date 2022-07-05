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
let removeDegree: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    findOneOrFail = jest.spyOn(api.userRepo, 'findOneOrFail')
    removeDegree = jest.spyOn(api.userRepo, 'removeDegree')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

async function testRequest() {
  await request(app).delete(
    '/user/924a4c06-4ccb-4208-8791-ecae4099a763/degree/29c8d293-6188-4ed1-a9c3-52c097a87194'
  )
}

test('`findOneOrFail` is called once', async () => {
  await testRequest()

  expect(findOneOrFail).toBeCalledTimes(1)
})

test('`removeDegree` is called zero times', async () => {
  /**
   * called zero times because there is no valid user found to operate on
   */
  await testRequest()

  expect(removeDegree).toBeCalledTimes(0)
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
