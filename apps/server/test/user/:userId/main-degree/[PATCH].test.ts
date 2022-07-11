import request from 'supertest'
import { getApp } from 'app'
import type { Express } from 'express'
import { Api } from '@modtree/repos'
import { mocks } from '@modtree/test-env'

jest.mock('@modtree/base-repo')
beforeEach(() => jest.clearAllMocks())

const api = new Api(mocks.db)
const app: Express = getApp(api)
const findOneOrFail: jest.SpyInstance = jest.spyOn(
  api.userRepo,
  'findOneOrFail'
)
const setMainDegree: jest.SpyInstance = jest.spyOn(
  api.userRepo,
  'setMainDegree'
)

async function testRequest() {
  await request(app)
    .patch('/user/924a4c06-4ccb-4208-8791-ecae4099a763/main-degree')
    .send({ degreeId: 'id' })
}

test('`findOneOrFail` is called once', async () => {
  await testRequest()

  expect(findOneOrFail).toBeCalledTimes(1)
})

test('`setMainDegree` is called zero times', async () => {
  /**
   * called zero times because there is no valid user found to operate on
   */
  await testRequest()

  expect(setMainDegree).toBeCalledTimes(0)
})

test('`findOneOrFail` is called with correct args', async () => {
  await testRequest()

  expect(findOneOrFail).toBeCalledWith({
    where: { id: '924a4c06-4ccb-4208-8791-ecae4099a763' },
    relations: {
      modulesDone: true,
      modulesDoing: true,
      savedDegrees: true,
      savedGraphs: true,
      mainDegree: true,
      mainGraph: true,
    },
  })
})
