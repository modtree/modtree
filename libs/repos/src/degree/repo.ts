import { DataSource } from 'typeorm'
import { Degree, InitDegreeProps } from '@modtree/types'
import { BaseRepo } from '../base'
import { ModuleRepository } from '../module'

export class DegreeRepository extends BaseRepo<Degree> {
  private moduleRepo: ModuleRepository

  constructor(db: DataSource) {
    super(Degree, db)
    this.moduleRepo = new ModuleRepository(db)
  }

  /** one-liners */
  deleteAll = () => this.createQueryBuilder().delete().execute()

  findOneByTitle = async (title: string) =>
    this.findOne({
      where: { title },
      relations: this.relations,
    })

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
      .findByCodes(moduleCodes)
      .then((modules) =>
        this.save({ ...degree, modules: [...degree.modules, ...modules] })
      )
  }

  /**
   * modifies a Degree
   *
   * @param {Degree} degree
   * @param {InitDegreeProps} props
   * @returns {Promise<Degree>}
   */
  async update(degree: Degree, props: InitDegreeProps): Promise<Degree> {
    return this.moduleRepo.findByCodes(props.moduleCodes).then((modules) => {
      degree.title = props.title
      degree.modules = modules
      return this.save(degree)
    })
  }
}
