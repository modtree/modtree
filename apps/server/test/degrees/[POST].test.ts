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
let initialize: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    initialize = jest.spyOn(api.degreeRepo, 'initialize')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

const testRequest = async () =>
  request(app)
    .post('/degrees')
    .send({ moduleCodes: ['CS1010', 'MA1100'], title: 'Test Degree' })

test('`initialize` is called once', async () => {
  await testRequest()

  expect(initialize).toBeCalledTimes(1)
})

test('`initialize` is called with correct args', async () => {
  await testRequest()

  expect(initialize).toBeCalledWith({
    moduleCodes: ['CS1010', 'MA1100'],
    title: 'Test Degree',
  })
})
