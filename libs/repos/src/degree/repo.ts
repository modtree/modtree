import { DataSource, In } from 'typeorm'
import {
  Degree,
  IDegreeRepository,
  IModuleRepository,
  InitDegreeProps,
} from '@modtree/types'
import { BaseRepo } from '../base'
import { ModuleRepository } from '../module'

export class DegreeRepository
  extends BaseRepo<Degree>
  implements IDegreeRepository
{
  private moduleRepo: IModuleRepository

  constructor(db: DataSource) {
    super(Degree, db)
    this.moduleRepo = new ModuleRepository(db)
  }

  /** one-liners */
  deleteAll = () => this.repo.createQueryBuilder().delete().execute()

  findOneById = async (id: string) =>
    this.repo.findOneOrFail({ where: { id }, relations: this.relations })

  findOneByTitle = async (title: string) =>
    this.repo.findOneOrFail({
      where: { title },
      relations: this.relations,
    })

  /**
   * @param {string[]} degreeIds
   * @returns {Promise<Degree[]>}
   */
  async findByIds(degreeIds: string[]): Promise<Degree[]> {
    return this.repo.find({
      where: {
        id: In(degreeIds),
      },
      relations: this.relations,
    })
  }

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
        this.repo.save(this.repo.create({ title: props.title, modules }))
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
      .findByCodes(moduleCodes)
      .then((modules) =>
        this.repo.save({ ...degree, modules: [...degree.modules, ...modules] })
      )
  }

  /**
   * modifies a Degree
   *
   * @param {Degree} degree
   * @param {InitDegreeProps} props
   * @returns {Promise<Degree>}
   */
  async modify(degree: Degree, props: InitDegreeProps): Promise<Degree> {
    return this.moduleRepo.findByCodes(props.moduleCodes).then((modules) => {
      degree.title = props.title
      degree.modules = modules
      return this.repo.save(degree)
    })
  }
}
