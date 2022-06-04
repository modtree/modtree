import { DataSource } from 'typeorm'
import { container } from '../src/data-source'
import { Degree, Graph, User } from '../src/entity'
import type * as InitProps from '../types/init-props'
import {
  DegreeRepository,
  GraphRepository,
  UserRepository,
} from '../src/repository'

type EntityRecord = {
  user: User
  degree: Degree
  graph: Graph
}

type MockupUser = Pick<EntityRecord, 'user' | 'degree'>
type MockupDegree = Pick<EntityRecord, 'degree'>
type MockupGraph = Pick<EntityRecord, 'user' | 'degree' | 'graph'>

type MockupPromises = {
  user: (db: DataSource, props: InitProps.User) => Promise<User>
  degree: (db: DataSource, props: InitProps.Degree) => Promise<Degree>
  graph: (db: DataSource, props: InitProps.Graph) => Promise<Graph>
}

/** mockup generator for tests */
export default class Mockup {
  private static promise: MockupPromises = {
    user: (db: DataSource, props: InitProps.User) =>
      UserRepository(db).initialize(props),
    degree: (db: DataSource, props: InitProps.Degree) =>
      DegreeRepository(db).initialize(props),
    graph: (db: DataSource, props: InitProps.Graph) =>
      GraphRepository(db).initialize(props),
  }

  /**
   * Performs the setup to initialize a User with saved Degrees
   * init user, init degree
   *
   * @param {DataSource} db
   * @param {InitProps.User} userProps
   * @param {InitProps.Degree} degreeProps
   * @returns {Promise<MockupUser>}
   */
  static user(
    db: DataSource,
    userProps: InitProps.User,
    degreeProps: InitProps.Degree
  ): Promise<MockupUser> {
    return new Promise((resolve, reject) => {
      container(db, async () =>
        Promise.all([
          this.promise.user(db, userProps),
          this.promise.degree(db, degreeProps),
        ])
          .then(([user, degree]) => resolve({ user, degree }))
          .catch(() => reject(new Error('Unable to complete mockup for User')))
      )
    })
  }

  /**
   * Performs the setup to initialize a Graph
   * init user, init degree
   *
   * @param {DataSource} db
   * @param {InitProps.User} userProps
   * @param {InitProps.Degree} degreeProps
   * @returns {Promise<MockupGraph>}
   */
  static graph(
    db: DataSource,
    userProps: InitProps.User,
    degreeProps: InitProps.Degree
  ): Promise<MockupGraph> {
    return new Promise((resolve, reject) => {
      container(db, async () =>
        Promise.all([
          Mockup.promise.user(db, userProps),
          Mockup.promise.degree(db, degreeProps),
        ])
          .then(([user, degree]) => {
            const graphProps: InitProps.Graph = {
              userId: user.id,
              degreeId: degree.id,
              modulesPlacedCodes: [],
              modulesHiddenCodes: [],
              pullAll: false,
            }
            return Promise.all([
              GraphRepository(db).initialize(graphProps),
              user,
              degree,
            ])
          })
          .then(([graph, user, degree]) => resolve({ graph, user, degree }))
          .catch(() => reject(new Error('Unable to complete mockup for Graph')))
      )
    })
  }

  /**
   * Performs the setup to initialize a Graph
   * init user, init degree
   *
   * @param {DataSource} db
   * @param {InitProps.Degree} degreeProps
   * @returns {Promise<MockupDegree>}
   */
  static degree(
    db: DataSource,
    degreeProps: InitProps.Degree
  ): Promise<MockupDegree> {
    return new Promise((resolve, reject) => {
      container(db, async () =>
        Promise.all([Mockup.promise.degree(db, degreeProps)])
          .then(([degree]) => resolve({ degree }))
          .catch(() =>
            reject(new Error('Unable to complete mockup for Degree'))
          )
      )
    })
  }
}
