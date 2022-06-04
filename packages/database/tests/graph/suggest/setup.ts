import { DataSource } from 'typeorm'
import { Degree, User, Graph } from '../../../src/entity'
import Init from '../../init'
import type * as InitProps from '../../../types/entity'
import { DegreeRepository, GraphRepository, UserRepository } from '../../../src/repository'
import { container } from '../../../src/data-source'

const degreeProps: InitProps.Degree = {
  moduleCodes: [
    'CS1010',
    'CG2111A', // in modulesDone, should not suggest
    'IT2002', // in modulesDoing, should not suggest
    'CS2030', // unlocks CS2104, CS3240, IS2103, IS2102 (4 mods)
    'CS2040S', // cannot take this mod (without CS1231)
    'CS2100', // unlocks CS3210, CS3237, CS2106 (3 mods)
    'CS2107', // unlocks IS4231, IS5151, IFS4101 (3 mods)
    'CP2106', // unlocks 0 mods
  ],
  title: 'Custom Degree'
}

const userProps: InitProps.User = {
  ...Init.emptyUser,
  modulesDone: ['CS1010', 'CG2111A'],
  modulesDoing: ['IT2002'],
}

/**
 * Performs the setup to initialize a Graph
 * init user, init degree
 *
 * @param {DataSource} db
 * @returns {Promise<Graph | void>}
 */
export async function setupGraph(db: DataSource): Promise<Graph | void> {
  let user: User
  let degree: Degree
  const res = await container(db, async () => {
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
    // init graph, depends on user and degree
    const graphProps: InitProps.Graph = {
      userId: user.id,
      degreeId: degree.id,
      modulesPlacedCodes: [],
      modulesHiddenCodes: [],
      pullAll: false,
    }
    const graph = await GraphRepository(db).initialize(graphProps)
    return { user, degree, graph }
  })
  if (!res) return
  return res.graph
}
