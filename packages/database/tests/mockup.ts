import { DataSource } from 'typeorm'
import { container } from '../src/data-source'
import { Degree, Graph, User } from '../src/entity'
import { DegreeRepository, UserRepository } from '../src/repository'
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

export class mockup {
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
        const userPromise = UserRepository(db).initialize(init.user1)
        const degreePromise = DegreeRepository(db).initialize(init.degree1)
        return Promise.all([userPromise, degreePromise])
          .then(([user, degree]) => {
            return resolve({ user, degree })
          })
          .catch((res) => {
            return reject(res)
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
        /**
         * load this in for rejects
         */
        const empty = {
          user: UserRepository(db).create(),
          degree: DegreeRepository(db).create(),
        }
        const userPromise = UserRepository(db).initialize(init.user1)
        const degreePromise = DegreeRepository(db).initialize(init.degree1)
        return Promise.all([userPromise, degreePromise])
          .then(([user, degree]) => {
            return resolve({ user, degree })
          })
          .catch(() => {
            /**
             * if either fail, then reject with the empty variable
             */
            return reject(empty)
          })
      })
    })
  }

  /**
   * Performs the setup to initialize a Graph
   * init user, init degree
   *
   * @param {DataSource} db
   * @return {Promise<Mockup>}
   */
  static degree(db: DataSource): Promise<Mockup.Degree> {
    return new Promise((resolve, reject) => {
      container(db, async () => {
        const empty = DegreeRepository(db).create()
        return await DegreeRepository(db)
          .initialize(init.degree1)
          .then((degree) => {
            return resolve({ degree })
          })
          .catch(() => {
            reject({ degree: empty })
          })
      })
    })
  }
}
