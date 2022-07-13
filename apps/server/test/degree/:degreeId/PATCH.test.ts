import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const findOneById: jest.SpyInstance = jest.spyOn(api.degreeRepo, 'findOneById')

const testRequest = async () =>
  request(app)
    .patch('/degree/58201858-5ce5-4ceb-8568-eecf55841b9f')
    .send({ title: 'test degree', moduleCodes: ['CS1010', 'MA1100'] })

test('`findOneById` is called once', async () => {
  await testRequest()

  expect(findOneById).toBeCalledTimes(1)
})

test('`findOneById` is called with correct args', async () => {
  await testRequest()

  expect(findOneById).toBeCalledWith('58201858-5ce5-4ceb-8568-eecf55841b9f')
})
