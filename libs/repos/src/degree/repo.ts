import { DataSource, In, Repository } from 'typeorm'
import {
  Degree,
  IDegreeRepository,
  IModuleRepository,
  InitDegreeProps,
} from '@modtree/types'
import { useDeleteAll } from '../utils'
import { getRelationsFromMetadata } from '../utils/get-relation-names'

export class DegreeRepository
  extends Repository<Degree>
  implements IDegreeRepository
{
  private allRelations: Record<string, boolean>
  private moduleRepo: IModuleRepository

  constructor(db: DataSource, repos: { module: IModuleRepository }) {
    super(Degree, db.manager)
    this.allRelations = getRelationsFromMetadata(db.getMetadata(Degree))
    this.moduleRepo = repos.module
  }

  deleteAll = useDeleteAll(this)
  override findOneById = async (id: string) => this.findOneByOrFail({ id })
  findOneByTitle = async (title: string) => this.findOneByOrFail({ title })

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
