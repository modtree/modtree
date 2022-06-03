import { Degree } from '../../src/entity'
import { init } from '../init'
import { DegreeRepository } from '../../src/repository'
import { DataSource } from 'typeorm'
import { container } from '../../src/data-source'

/**
 * Performs the setup to initialize a Graph
 * init user, init degree
 *
 * @param {DataSource} db
 * @return {Promise<Degree>}
 */
export function setupDegree(db: DataSource): Promise<Degree> {
  return new Promise((resolve, reject) => {
    container(db, async () => {
      const empty = DegreeRepository(db).create()
      return await DegreeRepository(db)
        .initialize(init.degree1)
        .then((degree) => {
          return resolve(degree)
        })
        .catch(() => {
          reject(empty)
        })
    })
  })
}
