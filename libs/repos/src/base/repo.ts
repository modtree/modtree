import { IBaseRepository, Relations, EntityTarget } from '@modtree/types'
import {
  DataSource,
  DeepPartial,
  EntityManager,
  EntityMetadata,
  FindManyOptions,
  FindOneOptions,
  In,
  Repository,
} from 'typeorm'
import { getRelations } from './get-relations'

export class BaseRepo<Entity extends { id: string }>
  implements IBaseRepository<Entity>
{
  /** don't expose any organic TypeORM methods outside at all */
  private repo: Repository<Entity>
  private readonly manager: EntityManager
  readonly target: EntityTarget<Entity>
  readonly metadata: EntityMetadata

  /** direct inheritance */
  count: Repository<Entity>['count']
  findAndCount: Repository<Entity>['findAndCount']
  remove: Repository<Entity>['remove']
  delete: Repository<Entity>['delete']
  find: Repository<Entity>['find']
  findOne: Repository<Entity>['findOneOrFail']
  createQueryBuilder: Repository<Entity>['createQueryBuilder']

  /** custom fields */
  relations: Relations

  /** instantiate base repository */
  constructor(target: EntityTarget<Entity>, db: DataSource) {
    this.repo = new Repository(target, db.manager)
    this.manager = db.manager
    this.target = target
    this.metadata = this.repo.metadata

    /** direct inheritance */
    this.find = this.repo.find.bind(this.repo)
    this.count = this.repo.count.bind(this.repo)
    this.findAndCount = this.repo.findAndCount.bind(this.repo)
    this.remove = this.repo.remove.bind(this.repo)
    this.delete = this.repo.delete.bind(this.repo)
    this.findOne = this.repo.findOneOrFail.bind(this.repo)
    this.createQueryBuilder = this.repo.createQueryBuilder.bind(this.repo)
    /** custom fields */
    this.relations = getRelations(this.repo)
  }

  private readonly reshape = (e: any): Entity =>
    this.manager.create(this.target, e)

  /**
   * TypeORM's builtin save doesn't return a type-safe entity.
   *
   * This override ensures that it does, through we could possibly move away
   * from this since save() is usually called at the end of processing
   * and may not really need to be type-safe at that point.
   */
  save(e: DeepPartial<Entity>): Promise<Entity>
  save(e: DeepPartial<Entity>[]): Promise<Entity[]>
  async save(
    e: DeepPartial<Entity> | DeepPartial<Entity>[]
  ): Promise<Entity | Entity[]> {
    if (Array.isArray(e)) {
      return this.repo.save(e).then((arr) => arr.map(this.reshape))
    } else {
      return this.repo.save(e).then(this.reshape)
    }
  }

  create(): Entity
  create(p: DeepPartial<Entity>[]): Entity[]
  create(p: DeepPartial<Entity>): Entity
  create(
    partial?: DeepPartial<Entity> | DeepPartial<Entity>[]
  ): Entity | Entity[] {
    return this.manager.create<any>(this.target, partial)
  }

  /**
   * finds one entity by an id
   * (with all first-level relations loaded)
   *
   * @param {string} id
   * @returns {Promise<Entity>}
   */
  async findOneById(id: string): Promise<Entity> {
    return this.findOne({
      where: { id },
      relations: this.relations,
    } as FindOneOptions<Entity>)
  }

  /**
   * finds entities by a list of ids
   * (with all first-level relations loaded)
   *
   * @param {string} ids
   * @returns {Promise<Entity[]>}
   */
  async findByIds(ids: string[]): Promise<Entity[]> {
    return this.find({
      where: { id: In(ids) },
      relations: this.relations,
    } as FindManyOptions<Entity>)
  }
}
