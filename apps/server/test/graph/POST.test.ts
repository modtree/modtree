import request from 'supertest'
import { getApp } from '@modtree/server/app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const initialize: jest.SpyInstance = jest.spyOn(api.graphRepo, 'initialize')

// dd9f2725-7a08-45f8-bbbb-10bb7e002bb3
// 017fc011-486c-4ec6-a038-9a92ab85a8f3

const testRequest = async () =>
  request(app).post('/graph').send({
    title: 'Test Graph',
    userId: '017fc011-486c-4ec6-a038-9a92ab85a8f3',
    degreeId: 'dd9f2725-7a08-45f8-bbbb-10bb7e002bb3',
  })

test('`initialize` is called once', async () => {
  await testRequest()

  expect(initialize).toBeCalledTimes(1)
})

test('`initialize` is called with correct args', async () => {
  await testRequest()

  expect(initialize).toBeCalledWith({
    title: 'Test Graph',
    userId: '017fc011-486c-4ec6-a038-9a92ab85a8f3',
    degreeId: 'dd9f2725-7a08-45f8-bbbb-10bb7e002bb3',
  })
})
