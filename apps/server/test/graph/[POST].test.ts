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
    initialize = jest.spyOn(api.graphRepo, 'initialize')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

// dd9f2725-7a08-45f8-bbbb-10bb7e002bb3
// 017fc011-486c-4ec6-a038-9a92ab85a8f3

const testRequest = async () =>
  request(app).post('/graph').send({
    userId: '017fc011-486c-4ec6-a038-9a92ab85a8f3',
    degreeId: 'dd9f2725-7a08-45f8-bbbb-10bb7e002bb3',
    modulesHiddenCodes: [],
    modulesPlacedCodes: [],
    pullAll: false,
  })

test('`initialize` is called once', async () => {
  await testRequest()

  expect(initialize).toBeCalledTimes(1)
})

test('`initialize` is called with correct args', async () => {
  await testRequest()

  expect(initialize).toBeCalledWith({
    userId: '017fc011-486c-4ec6-a038-9a92ab85a8f3',
    degreeId: 'dd9f2725-7a08-45f8-bbbb-10bb7e002bb3',
    modulesPlacedCodes: [],
    modulesHiddenCodes: [],
    pullAll: false,
  })
})
