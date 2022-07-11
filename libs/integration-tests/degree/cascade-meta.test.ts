import { setup, teardown } from '@modtree/test-env'
import { db } from '@modtree/typeorm-config'
import { Degree, Graph, User } from '@modtree/types'
import { EntityTarget } from 'typeorm'

beforeAll(() => setup(db, { restore: false }))
afterAll(() => teardown(db))

/**
 * [Entity Name, Attribute, Whether it cascades]
 */
const correct = [
  ['Graph', 'user', true], // deleting a user deletes its associated graphs
  ['Graph', 'degree', true], // deleting a degree deletes its associated graphs
  ['User', 'savedDegrees', false],
  ['User', 'savedGraphs', false],
  ['User', 'mainDegree', false],
  ['User', 'mainGraph', false],
]

type Row = [string, string, boolean]

test('cascades are correct', () => {
  const getRelations = <T>(target: EntityTarget<T>) => {
    const meta = db.getMetadata(target)
    return meta.relations.map((r) => [
      meta.name,
      r.propertyName,
      r.onDelete === 'CASCADE',
    ]) as Row[]
  }
  const relations = [User, Degree, Graph].reduce(
    (a, b) => a.concat(getRelations(b)),
    [] as Row[]
  )
  expect(relations).toStrictEqual(expect.arrayContaining(correct))
})
