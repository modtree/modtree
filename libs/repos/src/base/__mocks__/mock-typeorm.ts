import { Degree, Graph, User, Module } from '@modtree/types'
import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  Repository as TR,
} from 'typeorm'
import { moduleRepoFind } from './module-repo-find'

const log = console.log

const whip = <T>(e: any) => e as T

const coerce = {
  module: <T>(e: DeepPartial<T>): T => {
    const a = Object.assign(new Module(), e) as unknown as T
    return a
  },
  degree: <T>(e: DeepPartial<T>): T =>
    Object.assign(new Degree(), e) as unknown as T,
  user: <T>(e: DeepPartial<T>): T =>
    Object.assign(new User(), e) as unknown as T,
  graph: <T>(e: DeepPartial<T>): T =>
    Object.assign(new Graph(), e) as unknown as T,
}

export class Repository<T> extends TR<T> {
  override create(): T
  override create(e: DeepPartial<T>[]): T[]
  override create(e: DeepPartial<T>): T
  override create(e?: DeepPartial<T> | DeepPartial<T>[]): T | T[] {
    if (e === undefined) return []
    if (Array.isArray(e)) {
      if (this.target === Module) return e.map(coerce.module)
      if (this.target === Degree) return e.map(coerce.degree)
      if (this.target === User) return e.map(coerce.user)
      if (this.target === Graph) return e.map(coerce.graph)
    } else {
      if (this.target === Module) return coerce.module(e)
      if (this.target === Degree) return coerce.degree(e)
      if (this.target === User) return coerce.user(e)
      if (this.target === Graph) return coerce.graph(e)
    }
    // if (e instanceof User) return coerce.user(e)
    // if (e instanceof Graph) return coerce.graph(e)
    return []
  }
  override save = async <T>(e: T | T[]): Promise<T | T[]> => {
    return e
  }
  override async find(e?: FindManyOptions<T>): Promise<T[]> {
    return []
  }
  constructor(entity: EntityTarget<T>, manager: EntityManager) {
    super(entity, manager)
  }
}
