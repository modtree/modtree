import request from 'supertest'
import { getApp } from '@modtree/server/app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const findByCode: jest.SpyInstance = jest.spyOn(api.moduleRepo, 'findByCode')

const testRequest = () => request(app).get('/module/MA1100')

test('`findByCode` is called once', async () => {
  await testRequest()
  expect(findByCode).toBeCalledTimes(1)
})

test('`findByCode` is called with correct args', async () => {
  await testRequest()

  expect(findByCode).toBeCalledWith('MA1100')
})
