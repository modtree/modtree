import { DataSource } from 'typeorm'
import { container } from '../src/data-source'
import { Degree, Graph, User } from '../src/entity'
import type * as InitProps from '../types/init-props'
import {
  DegreeRepository,
  GraphRepository,
  UserRepository,
} from '../src/repository'

/** mockup generator for tests */
export default class Mockup {

  /**
   * Performs the setup to initialize a User with saved Degrees
   * init user, init degree
   *
   * @param {DataSource} db
   * @param {InitProps.User} userProps
   * @returns {Promise<User>}
   */
  static user(db: DataSource, userProps: InitProps.User): Promise<User> {
    return new Promise((resolve, reject) => {
      container(db, () =>
        UserRepository(db)
          .initialize(userProps)
          .then((user) => resolve(user))
          .catch(() => reject(new Error('Unable to complete mockup for User')))
      )
    })
  }

  /**
   * Performs the setup to initialize a Graph
   * init user, init degree
   *
   * @param {DataSource} db
   * @param {InitProps.Degree} degreeProps
   * @returns {Promise<Degree>}
   */
  static degree(
    db: DataSource,
    degreeProps: InitProps.Degree
  ): Promise<Degree> {
    return new Promise((resolve, reject) => {
      container(db, () =>
        DegreeRepository(db)
          .initialize(degreeProps)
          .then((degree) => resolve(degree))
          .catch(() =>
            reject(new Error('Unable to complete mockup for Degree'))
          )
      )
    })
  }

  /**
   * Performs the setup to initialize a Graph
   * init user, init degree
   *
   * @param {DataSource} db
   * @param {InitProps.Graph} degreeProps
   * @returns {Promise<Graph>}
   */
  static graph(db: DataSource, graphProps: InitProps.Graph): Promise<Graph> {
    return new Promise((resolve, reject) => {
      container(db, () =>
        GraphRepository(db)
          .initialize(graphProps)
          .then((graph) => resolve(graph))
          .catch(() =>
            reject(new Error('Unable to complete mockup for Degree'))
          )
      )
    })
  }
}
