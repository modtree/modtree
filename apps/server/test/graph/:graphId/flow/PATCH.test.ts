import request from 'supertest'
import { getApp } from '@modtree/server/app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const findOneById: jest.SpyInstance = jest.spyOn(api.graphRepo, 'findOneById')

// dd9f2725-7a08-45f8-bbbb-10bb7e002bb3
// 017fc011-486c-4ec6-a038-9a92ab85a8f3

const testRequest = async () =>
  request(app).patch('/graph/017fc011-486c-4ec6-a038-9a92ab85a8f3/flow').send({
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
  request(app).patch('/graph/017fc011-486c-4ec6-a038-9a92ab85a8f3/flow').send({
    flowNodes: 'NOT_VALID', // supposed to be array
    flowEdges: 'NOT_VALID', // supposed to be array
  })

test('status 400 on invalid body', async () => {
  const res = await badRequest()

  expect(res.statusCode).toBe(400)
})
