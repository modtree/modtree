import { Degree } from '@modtree/entity'
import { Create, Delete, server, t, init } from '@modtree/test-env'

beforeAll(async () => {
  return Promise.all([
    Create.Degree(init.degree1),
    Create.Degree(init.degree2),
  ]).then(([degree1, degree2]) => {
    t.degreeId1 = degree1.id
    t.degreeId2 = degree2.id
  })
})
afterAll(() =>
  Promise.all([Delete.Degree(t.degreeId1), Delete.Degree(t.degreeId2)])
)

/**
 * list all degrees
 */
test('It should list all degrees', async () => {
  await server.get('degree/list').then((res) => {
    const degrees: Degree[] = res.data
    degrees.forEach((degree) => {
      expect(degree).toBeDefined()
    })
    /**
     * flatten the ids
     */
    const ids = degrees.map((u) => u.id)
    /**
     * check that the list of all ids contains the two created ids
     */
    expect(ids).toEqual(expect.arrayContaining([t.degreeId1, t.degreeId2]))
  })
})
