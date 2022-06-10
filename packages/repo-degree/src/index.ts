import { DataSource, In, Repository } from 'typeorm'
import { Degree } from '@modtree/entity'
import { InitProps, IDegreeRepository, IModuleRepository } from '@modtree/types'
import { copy } from '@modtree/utils'
import {
  getRelationNames,
  useDeleteAll,
  useFindOneByKey,
} from '@modtree/repo-base'
import { getModuleRepository } from '@modtree/repo-module'

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
    this.moduleRepo = getModuleRepository(this.db)
  }

  deleteAll = useDeleteAll(this)
  findOneById = useFindOneByKey(this, 'id')
  findOneByTitle = useFindOneByKey(this, 'title')

  /**
   * Adds a Degree to DB
   *
   * @param {InitProps['Degree']} props
   * @returns {Promise<Degree>}
   */
  async initialize(props: InitProps['Degree']): Promise<Degree> {
    const { moduleCodes, title } = props
    const degree = this.create({ title })
    // find modules required, to create many-to-many relation
    const modules = await this.moduleRepo.findByCodes(moduleCodes)
    degree.modules = modules
    await this.save(degree)
    return degree
  }

  /**
   * Adds Modules to a Degree
   *
   * @param {Degree} degree
   * @param {string[]} moduleCodes
   */
  async insertModules(degree: Degree, moduleCodes: string[]): Promise<Degree> {
    // find modules to add
    return Promise.all([
      this.moduleRepo.findBy({
        moduleCode: In(moduleCodes),
      }),
      this.findOneById(degree.id),
    ])
      .then(([newModules, loadedDegree]) => {
        copy(loadedDegree, degree)
        degree.modules.push(...newModules)
        return this.save(degree)
      })
      .then((updatedDegree) => {
        copy(updatedDegree, degree)
        return updatedDegree
      })
  }

  /**
   * @param {string[]} degreeIds
   * @returns {Promise<Degree[]>}
   */
  async findByIds(degreeIds: string[]): Promise<Degree[]> {
    return this.find({
      where: {
        id: In(degreeIds),
      },
      relations: this.allRelations,
    })
  }
}
