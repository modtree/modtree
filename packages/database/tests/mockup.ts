import { DataSource } from 'typeorm'
import { container } from '../src/data-source'
import { Degree, Graph, User } from '../src/entity'
import {
  DegreeRepository,
  GraphRepository,
  UserRepository,
} from '../src/repository'
import Init from './init'

type EntityRecord = {
  user: User
  degree: Degree
  graph: Graph
}

  type MockupUser = Pick<EntityRecord, 'user' | 'degree'>
  type MockupDegree = Pick<EntityRecord, 'degree'>
  type MockupGraph = Pick<EntityRecord, 'user' | 'degree'>

type MockupPromises = {
  user: (db: DataSource) => Promise<User>
  degree: (db: DataSource) => Promise<Degree>
  graph: (db: DataSource) => Promise<Graph>
}

/** mockup generator for tests */
export default class Mockup {
  private static promise: MockupPromises = {
    user: (db: DataSource) => UserRepository(db).initialize(Init.user1),
    degree: (db: DataSource) => DegreeRepository(db).initialize(Init.degree1),
    graph: (db: DataSource) => GraphRepository(db).initialize(Init.graph1),
  }

  /**
   * Performs the setup to initialize a User with saved Degrees
   * init user, init degree
   *
   * @param {DataSource} db
   * @returns {Promise<MockupUser>}
   */
  static user(db: DataSource): Promise<MockupUser> {
    return new Promise((resolve, reject) => {
      container(db, async () => Promise.all([this.promise.user(db), this.promise.degree(db)])
          .then(([user, degree]) => resolve({ user, degree }))
          .catch(() => reject(new Error('Unable to complete mockup for User'))))
    })
  }

  /**
   * Performs the setup to initialize a Graph
   * init user, init degree
   *
   * @param {DataSource} db
   * @returns {Promise<MockupGraph>}
   */
  static graph(db: DataSource): Promise<MockupGraph> {
    return new Promise((resolve, reject) => {
      container(db, async () => Promise.all([Mockup.promise.user(db), Mockup.promise.degree(db)])
          .then(([user, degree]) => resolve({ user, degree }))
          .catch(() => reject(new Error('Unable to complete mockup for Graph'))))
    })
  }

  /**
   * Performs the setup to initialize a Graph
   * init user, init degree
   *
   * @param {DataSource} db
   * @returns {Promise<MockupDegree>}
   */
  static degree(db: DataSource): Promise<MockupDegree> {
    return new Promise((resolve, reject) => {
      container(db, async () => Promise.all([Mockup.promise.degree(db)])
          .then(([degree]) => resolve({ degree }))
          .catch(() => reject(new Error('Unable to complete mockup for Degree'))))
    })
  }
}
