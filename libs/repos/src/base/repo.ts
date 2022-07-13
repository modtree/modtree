import { IBaseRepository, Relations } from '@modtree/types'
import { DataSource, EntityTarget, Repository } from 'typeorm'
import { getRelations } from './get-relations'

export class BaseRepo<Entity> implements IBaseRepository<Entity> {
  protected repo: Repository<Entity>
  relations: Relations
  /** direct inheritance */
  create: Repository<Entity>['create']
  save: Repository<Entity>['save']
  find: Repository<Entity>['find']
  count: Repository<Entity>['count']
  findOneOrFail: Repository<Entity>['findOneOrFail']
  createQueryBuilder: Repository<Entity>['createQueryBuilder']
  /** instantiate base repository */
  constructor(entity: EntityTarget<Entity>, db: DataSource) {
    this.repo = new Repository(entity, db.manager)
    this.relations = getRelations(this.repo)
    /** direct inheritance */
    this.create = this.repo.create.bind(this.repo)
    this.save = this.repo.save.bind(this.repo)
    this.find = this.repo.find.bind(this.repo)
    this.count = this.repo.count.bind(this.repo)
    this.findOneOrFail = this.repo.findOneOrFail.bind(this.repo)
    this.createQueryBuilder = this.repo.createQueryBuilder.bind(this.repo)
  }
}
