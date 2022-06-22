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
let _delete: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    _delete = jest.spyOn(api.graphRepo, 'delete')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

async function testRequest() {
  await request(app).delete('/graphs/924a4c06-4ccb-4208-8791-ecae4099a763')
}

test('`delete` is called once', async () => {
  await testRequest()

  expect(_delete).toBeCalledTimes(1)
})

test('`delete` is called with correct args', async () => {
  await testRequest()

  expect(_delete).toBeCalledWith({ id: '924a4c06-4ccb-4208-8791-ecae4099a763' })
})
