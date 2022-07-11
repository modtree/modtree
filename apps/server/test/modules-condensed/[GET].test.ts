import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const find: jest.SpyInstance = jest.spyOn(api.moduleCondensedRepo, 'find')
const findByCodes: jest.SpyInstance = jest.spyOn(
  api.moduleCondensedRepo,
  'findByCodes'
)

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
