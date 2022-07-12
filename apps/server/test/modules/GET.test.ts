import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const find: jest.SpyInstance = jest.spyOn(api.moduleRepo, 'find')

const testRequest = () => request(app).get('/modules')

test('`find` is called once', async () => {
  await testRequest()
  expect(find).toBeCalledTimes(1)
})

test('`find` is called with correct args', async () => {
  await testRequest()

  expect(find).toBeCalledWith()
})