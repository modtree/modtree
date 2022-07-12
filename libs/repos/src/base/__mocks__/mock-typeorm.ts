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
  SaveOptions,
} from 'typeorm'

const whip = <T>(e: any) => e as T
const assign = <T>(C: new () => any, e: DeepPartial<T>) =>
  whip<T>(Object.assign(new C(), e))

export class Repository<Entity> extends TR<Entity> {
  private coerce = (e: DeepPartial<Entity>): Entity => {
    if (this.target === Module) return assign(Module, e)
    if (this.target === ModuleCondensed) return assign(ModuleCondensed, e)
    if (this.target === ModuleFull) return assign(ModuleFull, e)
    if (this.target === Degree) return assign(Degree, e)
    if (this.target === User) return assign(User, e)
    if (this.target === Graph) return assign(Graph, e)
    return whip(e)
  }
  override create(): Entity
  override create(e: DeepPartial<Entity>[]): Entity[]
  override create(e: DeepPartial<Entity>): Entity
  override create(
    e?: DeepPartial<Entity> | DeepPartial<Entity>[]
  ): Entity | Entity[] {
    if (e === undefined) return []
    return Array.isArray(e) ? e.map(this.coerce) : this.coerce(e)
  }

  override async save<T extends DeepPartial<Entity>>(
    e: T | T[]
  ): Promise<T | T[]> {
    return Array.isArray(e)
      ? (e.map(this.coerce) as T[])
      : (this.coerce(e) as T)
  }

  override find = async (_?: FindManyOptions<Entity>): Promise<Entity[]> => []
  constructor(entity: EntityTarget<Entity>, manager: EntityManager) {
    super(entity, manager)
  }
}
