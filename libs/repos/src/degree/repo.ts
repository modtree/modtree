import { DataSource, In, Repository } from 'typeorm'
import {
  Degree,
  IDegreeRepository,
  IModuleRepository,
  InitDegreeProps,
  Relations,
} from '@modtree/types'
import { getRelationNames } from '../utils'
import { ModuleRepository } from '../module'

export class DegreeRepository
  extends Repository<Degree>
  implements IDegreeRepository
{
  private db: DataSource
  private allRelations = getRelationNames(this)
  private moduleRepo: IModuleRepository
  private relations: Relations

  constructor(db: DataSource) {
    super(Degree, db.manager)
    this.db = db
    this.moduleRepo = new ModuleRepository(this.db)
    this.relations = getRelationNames(this)
  }

  /** one-liners */
  deleteAll = () => this.createQueryBuilder().delete().execute()

  override findOneById = async (id: string) =>
    this.findOneOrFail({ where: { id }, relations: this.relations })

  findOneByTitle = async (title: string) =>
    this.findOneOrFail({ where: { title }, relations: this.relations })

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
   * modifies a Degree
   *
   * @param {Degree} degree
   * @param {InitDegreeProps} props
   * @returns {Promise<Degree>}
   */
  async modify(degree: Degree, props: InitDegreeProps): Promise<Degree> {
    return this.moduleRepo
      .findBy({
        moduleCode: In(props.moduleCodes),
      })
      .then((modules) => {
        degree.title = props.title
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
