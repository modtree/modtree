import {
  Degree,
  Graph,
  Module,
  ModuleCondensed,
  ModuleFull,
  User,
} from '@modtree/types'
import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  Repository as TR,
} from 'typeorm'

const whip = <T>(e: any) => e as T
const assign = <T>(C: new () => any, e: DeepPartial<T>) =>
  whip<T>(Object.assign(new C(), e))

export class Repository<T> extends TR<T> {
  private coerce = (e: DeepPartial<T>): T => {
    if (this.target === Module) return assign(Module, e)
    if (this.target === ModuleCondensed) return assign(ModuleCondensed, e)
    if (this.target === ModuleFull) return assign(ModuleFull, e)
    if (this.target === Degree) return assign(Degree, e)
    if (this.target === User) return assign(User, e)
    if (this.target === Graph) return assign(Graph, e)
    return whip(e)
  }
  override create(): T
  override create(e: DeepPartial<T>[]): T[]
  override create(e: DeepPartial<T>): T
  override create(e?: DeepPartial<T> | DeepPartial<T>[]): T | T[] {
    if (e === undefined) return []
    return Array.isArray(e) ? e.map(this.coerce) : this.coerce(e)
  }
  override save = async <T>(e: T | T[]): Promise<T | T[]> => e
  override find = async (_?: FindManyOptions<T>): Promise<T[]> => []
  constructor(entity: EntityTarget<T>, manager: EntityManager) {
    super(entity, manager)
  }
}
