import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const findOneById: jest.SpyInstance = jest.spyOn(api.userRepo, 'findOneById')
const remove: jest.SpyInstance = jest.spyOn(api.userRepo, 'remove')

async function testRequest() {
  await request(app).delete('/user/924a4c06-4ccb-4208-8791-ecae4099a763')
}

test('`findOneById` is called once', async () => {
  await testRequest()

  expect(findOneById).toBeCalledTimes(1)
})

test('`remove` is called zero times', async () => {
  /**
   * called zero times because there is no valid user found to operate on
   */
  await testRequest()

  expect(remove).toBeCalledTimes(0)
})

test('`findOneById` is called with correct args', async () => {
  await testRequest()

  expect(findOneById).toBeCalledWith('924a4c06-4ccb-4208-8791-ecae4099a763')
})
