import { Degree, User } from '../../src/entity'
import { init } from '../init'
import { DegreeRepository, UserRepository } from '../../src/repository'
import { DataSource } from 'typeorm'
import { container } from '../../src/data-source'

type Response = Partial<{
  user: User
  degree: Degree
}>

export async function setupDAG(db: DataSource): Promise<Response | void> {
  const degreeProps = init.degree1
  const userProps = init.user1
  const res = container(db, async () => {
    const res: Response = {}
    UserRepository(db)
      .initialize(userProps)
      .then(() => {
        UserRepository(db)
          .findOneByUsername(userProps.username)
          .then((user) => {
            res.user = user
          })
      })
    DegreeRepository(db)
      .initialize(degreeProps)
      .then(() => {
        DegreeRepository(db)
          .findOneByTitle(degreeProps.title)
          .then((degree) => {
            res.degree = degree
          })
      })
    return res
  })
  if (!res) throw new Error('Unable to setup DAG test.')
  return res
}
