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
let find: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    find = jest.spyOn(api.degreeRepo, 'find')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

const testRequest = async () => request(app).get('/degrees')

test('`find` is called once', async () => {
  await testRequest()

  expect(find).toBeCalledTimes(1)
})

test('`find` is called with correct args', async () => {
  await testRequest()

  expect(find).toBeCalledWith({
    relations: { modules: true },
  })
})
