import request from 'supertest'
import { getApp } from '@modtree/server/app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const initialize: jest.SpyInstance = jest.spyOn(api.degreeRepo, 'initialize')

const testRequest = async () =>
  request(app)
    .post('/degree')
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
