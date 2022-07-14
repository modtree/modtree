import { IBaseRepository, Relations } from '@modtree/types'
import {
  DataSource,
  DeepPartial,
  EntityTarget,
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
  private _save: Repository<Entity>['save']

  /** direct inheritance */
  create: Repository<Entity>['create']
  // save: Repository<Entity>['save']
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
  constructor(entity: EntityTarget<Entity>, db: DataSource) {
    this.repo = new Repository(entity, db.manager)

    /** direct inheritance */
    this.create = this.repo.create.bind(this.repo)
    this._save = this.repo.save.bind(this.repo)
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

  private reshape(data: any): Entity {
    const entity = this.create()
    Object.assign(entity, data)
    return entity
  }

  /**
   * TypeORM's builtin save doesn't return a type-safe entity.
   *
   * This override ensures that it does, through we could possibly move away
   * from this since save() is usually called at the end of processing
   * and may not really need to be type-safe at that point.
   */
  async save<T extends DeepPartial<Entity>>(e: T[]): Promise<Entity[]>
  async save<T extends DeepPartial<Entity>>(e: T): Promise<Entity>
  async save(e: any): Promise<any> {
    return this._save(e).then((res) => {
      if (Array.isArray(res)) {
        return res.map(this.reshape)
      } else {
        return this.reshape(res)
      }
    })
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
