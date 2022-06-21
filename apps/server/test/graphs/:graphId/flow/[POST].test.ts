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

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    findOneById = jest.spyOn(api.graphRepo, 'findOneById')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

// dd9f2725-7a08-45f8-bbbb-10bb7e002bb3
// 017fc011-486c-4ec6-a038-9a92ab85a8f3

const testRequest = async () =>
  request(app).post('/graphs/017fc011-486c-4ec6-a038-9a92ab85a8f3/flow').send({
    flowNodes: [],
    flowEdges: [],
  })

test('`findOneById` is called once', async () => {
  await testRequest()

  expect(findOneById).toBeCalledTimes(1)
})

test('`findOneById` is called with correct args', async () => {
  await testRequest()

  expect(findOneById).toBeCalledWith('017fc011-486c-4ec6-a038-9a92ab85a8f3')
})

const badRequest = async () =>
  request(app).post('/graphs/017fc011-486c-4ec6-a038-9a92ab85a8f3/flow').send({
    flowNodes: 'NOT_VALID', // supposed to be array
    flowEdges: 'NOT_VALID', // supposed to be array
  })

test('status 400 on invalid body', async () => {
  const res = await badRequest()

  expect(res.statusCode).toBe(400)
})
