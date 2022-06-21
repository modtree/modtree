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
let findOneById: jest.SpyInstance
let remove: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    findOneById = jest.spyOn(api.degreeRepo, 'findOneById')
    remove = jest.spyOn(api.degreeRepo, 'remove')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

async function testRequest() {
  await request(app).delete('/degrees/924a4c06-4ccb-4208-8791-ecae4099a763')
}

test('`findOneById` is called once', async () => {
  await testRequest()

  expect(findOneById).toBeCalledTimes(1)
})

test('`remove` is called zero times', async () => {
  /**
   * called zero times because there is no valid degree found to operate on
   */
  await testRequest()

  expect(remove).toBeCalledTimes(0)
})

test('`findOneById` is called with correct args', async () => {
  await testRequest()

  expect(findOneById).toBeCalledWith('924a4c06-4ccb-4208-8791-ecae4099a763')
})
