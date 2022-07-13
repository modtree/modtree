import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const findByIds: jest.SpyInstance = jest.spyOn(api.degreeRepo, 'findByIds')
const find: jest.SpyInstance = jest.spyOn(api.degreeRepo, 'find')

const testRequest = () => request(app).get('/degrees')

describe('without params', () => {
  test('`find` is not called', async () => {
    await testRequest()
    expect(find).toBeCalledTimes(0)
  })
})

const withQueryRequest = () =>
  request(app)
    .get('/degrees')
    .query({ degreeIds: ['10e3c552-fc7f-40b0-8af4-f0b171d4e041'] })

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
