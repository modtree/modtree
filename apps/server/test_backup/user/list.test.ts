import { User } from '@modtree/entity'
import { Create, Delete, server, t, init } from '@modtree/test-env'

beforeAll(async () => {
  return Promise.all([Create.User(init.user2), Create.User(init.user3)]).then(
    ([user1, user2]) => {
      t.userId1 = user1.id
      t.userId2 = user2.id
    }
  )
})
afterAll(() => Promise.all([Delete.User(t.userId1!), Delete.User(t.userId2!)]))

/**
 * list all users
 */
test('It should list all users', async () => {
  await server.get('user/list').then((res) => {
    const users: User[] = res.data
    users.forEach((user) => {
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('displayName')
      expect(user).toHaveProperty('username')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('modulesDone')
      expect(user).toHaveProperty('modulesDoing')
      expect(user).toHaveProperty('matriculationYear')
      expect(user).toHaveProperty('graduationYear')
      expect(user).toHaveProperty('graduationSemester')
      expect(user).toHaveProperty('savedDegrees')
      expect(user).toHaveProperty('savedGraphs')
    })
    /**
     * flatten the ids
     */
    const ids = users.map((u) => u.id)
    /**
     * check that the list of all ids contains the two created ids
     */
    expect(ids).toEqual(expect.arrayContaining([t.userId1, t.userId2]))
  })
})
