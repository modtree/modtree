import { Degree } from '../../../src/entity'
import { Create, Delete, server } from '../environment'
import Init from '../../init'
import { toBeUserResponse } from '../expect-extend'

const t: Partial<{ degreeId1: string; degreeId2: string }> = {}

beforeAll(async () => {
  expect.extend({ toBeUserResponse })
  return Promise.all([
    Create.Degree(Init.degree1),
    Create.Degree(Init.degree2),
  ]).then(([degree1, degree2]) => {
    t.degreeId1 = degree1.id
    t.degreeId2 = degree2.id
  })
})
afterAll(() => Promise.all([Delete.Degree(t.degreeId1), Delete.Degree(t.degreeId2)]))

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
