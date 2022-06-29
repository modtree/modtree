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
let findByCodes: jest.SpyInstance

beforeAll(() =>
  setup(db).then(() => {
    api = new Api(db)
    app = getApp(api)
    find = jest.spyOn(api.moduleCondensedRepo, 'find')
    findByCodes = jest.spyOn(api.moduleCondensedRepo, 'findByCodes')
  })
)
beforeEach(() => jest.clearAllMocks())
afterAll(() => teardown(db))

const testRequest = () => request(app).get('/modules-condensed')

describe('without params', () => {
  test('`find` is not called', async () => {
    await testRequest()
    expect(find).toBeCalledTimes(0)
  })
})

const withQueryRequest = () =>
  request(app)
    .get('/modules-condensed')
    .query({ moduleCodes: ['MA1100', 'MA2001'] })

describe('with query params', () => {
  /**
   * findByCodes actually calls find
   */
  test('`find` is called once', async () => {
    await withQueryRequest()
    expect(find).toBeCalledTimes(1)
  })

  test('`findByCodes` is called once', async () => {
    await withQueryRequest()
    expect(findByCodes).toBeCalledTimes(1)
  })

  test('`findByCodes` is called with correct args', async () => {
    await withQueryRequest()

    expect(findByCodes).toBeCalledWith(['MA1100', 'MA2001'])
  })
})
