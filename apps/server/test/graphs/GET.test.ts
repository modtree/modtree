import request from 'supertest'
import { getApp } from '@modtree/server/app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const find: jest.SpyInstance = jest.spyOn(api.graphRepo, 'find')
const findByIds: jest.SpyInstance = jest.spyOn(api.graphRepo, 'findByIds')

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
   * findByIds does not call this.find
   */
  test('`find` is called once', async () => {
    await withQueryRequest()
    expect(find).toBeCalledTimes(0)
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
