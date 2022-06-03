import { Degree, User } from '../../src/entity'
import { init } from '../init'
import { DegreeRepository, UserRepository } from '../../src/repository'
import { DataSource } from 'typeorm'
import { container } from '../../src/data-source'

type Response = {
  user: User
  degree: Degree
}

/**
 * Performs the setup to initialize a Graph
 * init user, init degree
 *
 * @param {DataSource} db
 * @return {Promise<Response | void>}
 */
export async function setupGraph(db: DataSource): Promise<Response> {
  return new Promise((resolve, reject) => {
    const degreeProps = init.degree1
    const userProps = init.user1
    container(db, async () => {
      /**
       * load this in for rejects
       */
      const empty = {
        user: UserRepository(db).create(),
        degree: DegreeRepository(db).create(),
      }
      let user: User
      let degree: Degree
      const userPromise = UserRepository(db)
        .initialize(userProps)
        .then(() => UserRepository(db).findOneByUsername(userProps.username))
        .then((res) => {
          user = res
        })
      const degreePromise = DegreeRepository(db)
        .initialize(degreeProps)
        .then(() => DegreeRepository(db).findOneByTitle(degreeProps.title))
        .then((res) => {
          degree = res
        })
      return Promise.all([userPromise, degreePromise])
        .then(() => {
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
