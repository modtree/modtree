import { DataSource } from 'typeorm'
import { container } from '../src/data-source'
import { Degree, Graph, User } from '../src/entity'
import {
  DegreeRepository,
  GraphRepository,
  UserRepository,
} from '../src/repository'
import { init } from './init'

type EntityRecord = {
  user: User
  degree: Degree
  graph: Graph
}

namespace Mockup {
  export type User = Pick<EntityRecord, 'user' | 'degree'>
  export type Degree = Pick<EntityRecord, 'degree'>
  export type Graph = Pick<EntityRecord, 'user' | 'degree'>
}

type MockupPromises = {
  user: (db: DataSource) => Promise<User>
  degree: (db: DataSource) => Promise<Degree>
  graph: (db: DataSource) => Promise<Graph>
}

/** mockup generator for tests */
export class mockup {
  private static promise: MockupPromises = {
    user: (db: DataSource) => UserRepository(db).initialize(init.user1),
    degree: (db: DataSource) => DegreeRepository(db).initialize(init.degree1),
    graph: (db: DataSource) => GraphRepository(db).initialize(init.graph1),
  }

  /**
   * Performs the setup to initialize a User with saved Degrees
   * init user, init degree
   *
   * @param {DataSource} db
   * @return {Promise<Mockup.User>}
   */
  static user(db: DataSource): Promise<Mockup.User> {
    return new Promise((resolve, reject) => {
      container(db, async () => {
        return Promise.all([this.promise.user(db), this.promise.degree(db)])
          .then(([user, degree]) => {
            return resolve({ user, degree })
          })
          .catch(() => {
            return reject(new Error('Unable to complete mockup for User'))
          })
      })
    })
  }

  /**
   * Performs the setup to initialize a Graph
   * init user, init degree
   *
   * @param {DataSource} db
   * @return {Promise<Mockup.Graph>}
   */
  static graph(db: DataSource): Promise<Mockup.Graph> {
    return new Promise((resolve, reject) => {
      container(db, async () => {
        return Promise.all([mockup.promise.user(db), mockup.promise.degree(db)])
          .then(([user, degree]) => {
            return resolve({ user, degree })
          })
          .catch(() => {
            return reject(new Error('Unable to complete mockup for Graph'))
          })
      })
    })
  }

  /**
   * Performs the setup to initialize a Graph
   * init user, init degree
   *
   * @param {DataSource} db
   * @return {Promise<Mockup.Degree>}
   */
  static degree(db: DataSource): Promise<Mockup.Degree> {
    return new Promise((resolve, reject) => {
      container(db, async () => {
        return Promise.all([mockup.promise.degree(db)])
          .then(([degree]) => {
            return resolve({ degree })
          })
          .catch(() => {
            return reject(new Error('Unable to complete mockup for Degree'))
          })
      })
    })
  }
}
