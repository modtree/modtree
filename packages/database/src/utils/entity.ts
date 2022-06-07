import { ResponseProps } from '../../types/api-response'
import { Degree, Graph, Module, ModuleCondensed, User } from '../entity'

/** flattens TypeORM entities */
export const flatten = {
  /**
   * flattens a module to its module code
   *
   * @param {Module | ModuleCondensed} module
   * @returns {string} module code
   */
  module(module: Module | ModuleCondensed): string {
    return module.moduleCode
  },

  /**
   * flattens a user to response shape
   *
   * @param {User} user
   * @returns {response.User}
   */
  user(user: User): ResponseProps['User'] {
    return {
      ...user,
      modulesDoing: user.modulesDoing.map(flatten.module),
      modulesDone: user.modulesDone.map(flatten.module),
      savedDegrees: user.savedDegrees.map((d) => d.id),
      savedGraphs: [],
    }
  },

  /**
   * flattens a graph to response shape
   *
   * @param {Graph} graph
   * @returns {response.Graph}
   */
  graph(graph: Graph): ResponseProps['Graph'] {
    return {
      id: graph.id,
      user: graph.user.id,
      degree: graph.degree.id,
      modulesHidden: graph.modulesHidden.map(flatten.module),
      modulesPlaced: graph.modulesPlaced.map(flatten.module),
    }
  },

  /**
   * flattens a degree to response shape
   *
   * @param {Degree} degree
   * @returns {response.Degree}
   */
  degree(degree: Degree): ResponseProps['Degree'] {
    return { ...degree, modules: degree.modules.map(flatten.module) }
  },
}
