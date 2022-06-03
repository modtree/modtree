import type { Module, ModuleCondensed, User, Degree, Graph } from '../entity'
import type { response } from '../../types/api-response'

/** flattens TypeORM entities */
export class flatten {
  /**
   * flattens a module to its module code
   * @param {Module | ModuleCondensed} module
   * @return {string} module code
   */
  static module(module: Module | ModuleCondensed): string {
    return module.moduleCode
  }

  /**
   * flattens a user to response shape
   * @param {User} user
   * @return {response.User}
   */
  static user(user: User): response.User {
    return {
      ...user,
      modulesDoing: user.modulesDoing.map(flatten.module),
      modulesDone: user.modulesDone.map(flatten.module),
      savedDegrees: user.savedDegrees.map((d) => d.id),
    }
  }

  /**
   * flattens a graph to response shape
   * @param {Graph} graph
   * @return {response.Graph}
   */
  static graph(graph: Graph): response.Graph {
    return {
      id: graph.id,
      user: graph.user.id,
      degree: graph.degree.id,
      modulesHidden: graph.modulesHidden.map(flatten.module),
      modulesPlaced: graph.modulesPlaced.map(flatten.module),
    }
  }

  /**
   * flattens a degree to response shape
   * @param {Degree} degree
   * @return {response.Degree}
   */
  static degree(degree: Degree): response.Degree {
    return { ...degree, modules: degree.modules.map(flatten.module) }
  }
}
