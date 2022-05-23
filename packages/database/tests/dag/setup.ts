import { Degree, User } from '../../src/entity'
import { init } from '../init'
import { DegreeRepository, UserRepository } from '../../src/repository'
import { DataSource } from 'typeorm'
import { container } from '../../src/data-source'

type Response = [User, Degree]

export async function setupDAG(db: DataSource): Promise<Response | void> {
  const degreeProps = init.degree1
  const userProps = init.user1
  const res = await container(db, async () => {
    let user: User
    let degree: Degree
    const userRes = UserRepository(db)
      .initialize(userProps)
      .then(async () => {
        user = await UserRepository(db).findOneByUsername(userProps.username)
      })
    const degreeRes = DegreeRepository(db)
      .initialize(degreeProps)
      .then(async () => {
        degree = await DegreeRepository(db).findOneByTitle(degreeProps.title)
      })
    await Promise.all([userRes, degreeRes])
    return { user, degree }
  })
  if (!res) return
  return [res.user, res.degree]
}
