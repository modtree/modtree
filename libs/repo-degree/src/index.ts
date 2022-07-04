import { DataSource, In, Repository } from 'typeorm'
import { Degree } from '@modtree/entity'
import {
  IDegreeRepository,
  IModuleRepository,
  FindByKey,
  IDegree,
  InitDegreeProps,
} from '@modtree/types'
import {
  getRelationNames,
  useDeleteAll,
  useFindOneByKey,
} from '@modtree/repo-base'
import { ModuleRepository } from '@modtree/repo-module'

export class DegreeRepository
  extends Repository<Degree>
  implements IDegreeRepository
{
  private db: DataSource
  private allRelations = getRelationNames(this)
  private moduleRepo: IModuleRepository

  constructor(db: DataSource) {
    super(Degree, db.manager)
    this.db = db
    this.moduleRepo = new ModuleRepository(this.db)
  }

  deleteAll = useDeleteAll(this)
  override findOneById: FindByKey<IDegree> = useFindOneByKey(this, 'id')
  findOneByTitle = useFindOneByKey(this, 'title')

  /**
   * Adds a Degree to DB
   *
   * @param {InitDegreeProps} props
   * @returns {Promise<Degree>}
   */
  async initialize(props: InitDegreeProps): Promise<Degree> {
    return this.moduleRepo
      .findByCodes(props.moduleCodes)
      .then((modules) =>
        this.save(this.create({ title: props.title, modules }))
      )
  }

  /**
   * Adds Modules to a Degree
   *
   * @param {Degree} degree
   * @param {string[]} moduleCodes
   * @returns {Promise<Degree>}
   */
  async insertModules(degree: Degree, moduleCodes: string[]): Promise<Degree> {
    return this.moduleRepo
      .findBy({
        moduleCode: In(moduleCodes),
      })
      .then((modules) => {
        degree.modules.push(...modules)
        return this.save(degree)
      })
  }

  /**
   * sets Modules of a Degree
   *
   * @param {Degree} degree
   * @param {string[]} moduleCodes
   * @returns {Promise<Degree>}
   */
  async setModules(degree: Degree, moduleCodes: string[]): Promise<Degree> {
    return this.moduleRepo
      .findBy({
        moduleCode: In(moduleCodes),
      })
      .then((modules) => {
        degree.modules = modules
        return this.save(degree)
      })
  }

  /**
   * @param {string[]} degreeIds
   * @returns {Promise<Degree[]>}
   */
  override async findByIds(degreeIds: string[]): Promise<Degree[]> {
    return this.find({
      where: {
        id: In(degreeIds),
      },
      relations: this.allRelations,
    })
  }
}
