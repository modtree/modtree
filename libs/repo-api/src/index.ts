import { DataSource } from 'typeorm'
import {
  IUserRepository,
  IDegreeRepository,
  IGraphRepository,
} from '@modtree/types'
import { emptyInit } from '@modtree/utils'
import { UserRepository } from '@modtree/repo-user'
import { DegreeRepository } from '@modtree/repo-degree'
import { GraphRepository } from '@modtree/repo-graph'
import { User } from '@modtree/entity'

export class Api {
  private db: DataSource
  private degreeRepo: IDegreeRepository
  private userRepo: IUserRepository
  private graphRepo: IGraphRepository

  constructor(db: DataSource) {
    this.db = db
    this.degreeRepo = new DegreeRepository(this.db)
    this.userRepo = new UserRepository(this.db)
    this.graphRepo = new GraphRepository(this.db)
  }

  /**
   * Creates a functional User entity, with a default degree and a
   * default graph.
   *
   * It only takes auth0 id and email, since those are the only two
   * asked for at user sign-up
   *
   * @param {string} authZeroId
   * @returns {string} email
   */
  async initializeUser(authZeroId: string, email: string): Promise<User> {
    return Promise.all([
      /** initialize a user and an empty degree */
      this.userRepo.initialize({ ...emptyInit.User, authZeroId, email }),
      this.degreeRepo.initialize({ title: 'Untitled', moduleCodes: [] }),
    ])
      .then(([user, degree]) => {
        return Promise.all([
          user,
          degree,
          /** initialize an empty graph */
          this.graphRepo.initialize({
            userId: user.id,
            degreeId: degree.id,
            modulesHiddenCodes: [],
            modulesPlacedCodes: [],
            pullAll: false,
          }),
        ])
      })
      .then(([user, degree, graph]) => {
        /** add the degree to the user */
        user.savedDegrees.push(degree)
        /** add the graph to the user */
        user.savedGraphs.push(graph)
        /** save and return the user */
        return this.userRepo.save(user)
      })
  }
}
