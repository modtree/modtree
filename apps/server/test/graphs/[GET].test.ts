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
let findByIds: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    find = jest.spyOn(api.graphRepo, 'find')
    findByIds = jest.spyOn(api.graphRepo, 'findByIds')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

const testRequest = () => request(app).get('/graphs')

describe('without params', () => {
  test('`find` is not called', async () => {
    await testRequest()
    expect(find).toBeCalledTimes(0)
  })
})

const withQueryRequest = () =>
  request(app)
    .get('/graphs')
    .query({ graphIds: ['10e3c552-fc7f-40b0-8af4-f0b171d4e041'] })

describe('with query params', () => {
  /**
   * findByIds actually calls find
   */
  test('`find` is called once', async () => {
    await withQueryRequest()
    expect(find).toBeCalledTimes(1)
  })

  test('`findByIds` is called once', async () => {
    await withQueryRequest()
    expect(findByIds).toBeCalledTimes(1)
  })

  test('`findByIds` is called with correct args', async () => {
    await withQueryRequest()

    expect(findByIds).toBeCalledWith(['10e3c552-fc7f-40b0-8af4-f0b171d4e041'])
  })
})
