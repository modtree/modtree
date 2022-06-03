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
 * Performs the setup to initialize a User with saved Degrees
 * init user, init degree
 *
 * @param {DataSource} db
 * @return {Promise<Response | void>}
 */
export function setupUser(db: DataSource): Promise<Response> {
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
