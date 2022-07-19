import { Api } from '@modtree/repos'
import { api, Repo, setup, teardown } from '@modtree/test-env'
import { getSource } from '@modtree/typeorm-config'
import { User } from '@modtree/types'
import { oneUp } from '@modtree/utils'

const dbName = oneUp(__filename)
const db = getSource(dbName)
const user: User[] = []

beforeAll(() => setup(db))
afterAll(() => teardown(db))

/**
 * count and assert database user
 */
const expectUserCount = (n: number) =>
  test(`db has ${n} user(s)`, () => expect(Repo.User.count()).resolves.toBe(n))

/**
 * execute a user login and update the user variable
 */
const loginAndPushUser = (...args: Parameters<Api['userLogin2']>) =>
  api.userLogin2(...args).then((res) => {
    expect(res).toBeInstanceOf(User)
    user.push(res)
  })

expectUserCount(0)

/**
 * first login (GOOGLE)
 *
 * assigned to user[0]
 */
test('fresh login (google) → new user', () =>
  loginAndPushUser('test@user.com', 'google', 'google-id-1'))

expectUserCount(1)

it('sets google id', () => {
  expect(user[0]).toEqual(expect.objectContaining({ googleId: 'google-id-1' }))
})

/**
 * second login (GOOGLE)
 * should attach to the same user
 *
 * assigned to user[1]
 */
test('login again (google) → no change', () =>
  loginAndPushUser('test@user.com', 'google', 'google-id-2'))

/** is the same user as user[0] */
it('has same id', () => expect(user[0].id).toEqual(user[1].id))
it('has same email', () => expect(user[0].email).toEqual(user[1].email))

it('has updated google id', () => {
  expect(user[1]).toEqual(expect.objectContaining({ googleId: 'google-id-2' }))
})

expectUserCount(1)

/**
 * third login (FACEBOOK)
 *
 * assigned to user[2]
 */
test('login again (facebook) → no change', () =>
  loginAndPushUser('test@user.com', 'facebook', 'facebook-id'))

/** is the same user as user[0] */
it('has same id', () => expect(user[0].id).toEqual(user[2].id))
it('has same email', () => expect(user[0].email).toEqual(user[2].email))

it('has facebook id', () => {
  expect(user[2]).toEqual(
    expect.objectContaining({ facebookId: 'facebook-id' })
  )
})

expectUserCount(1)
