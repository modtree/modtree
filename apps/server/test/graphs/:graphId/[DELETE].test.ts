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

const testRequest = async () =>
  request(app).delete('/graphs/58201858-5ce5-4ceb-8568-eecf55841b9f')

test('`_delete` is called once', async () => {
  await testRequest()

  expect(_delete).toBeCalledTimes(1)
})

test('`_delete` is called with correct args', async () => {
  await testRequest()

  expect(_delete).toBeCalledWith({ id: '58201858-5ce5-4ceb-8568-eecf55841b9f' })
})