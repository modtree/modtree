import { Module, ModuleCondensed, User, Degree, Graph } from '../entity'
import { ResponseProps } from '../../types/api-response'

/** flattens TypeORM entities */
export class Flatten {
  /**
   * flattens a module to its module code
   *
   * @param {Module | ModuleCondensed} module
   * @returns {string} module code
   */
  static module(module: Module | ModuleCondensed): string {
    return module.moduleCode
  }

  /**
   * flattens a user to response shape
   *
   * @param {User} user
   * @returns {response.User}
   */
  static user(user: User): ResponseProps['User'] {
    return {
      ...user,
      modulesDoing: user.modulesDoing.map(Flatten.module),
      modulesDone: user.modulesDone.map(Flatten.module),
      savedDegrees: user.savedDegrees.map((d) => d.id),
      savedGraphs: [],
    }
  }

  /**
   * flattens a graph to response shape
   *
   * @param {Graph} graph
   * @returns {response.Graph}
   */
  static graph(graph: Graph): ResponseProps['Graph'] {
    return {
      id: graph.id,
      user: graph.user.id,
      degree: graph.degree.id,
      modulesHidden: graph.modulesHidden.map(Flatten.module),
      modulesPlaced: graph.modulesPlaced.map(Flatten.module),
    }
  }

  /**
   * flattens a degree to response shape
   *
   * @param {Degree} degree
   * @returns {response.Degree}
   */
  static degree(degree: Degree): ResponseProps['Degree'] {
    return { ...degree, modules: degree.modules.map(Flatten.module) }
  }
}
