import { DataSource, In } from 'typeorm'
import { Degree } from '@modtree/entity'
import { InitProps, IDegreeRepository } from '@modtree/types'
import { copy } from '@modtree/utils'
import {
  getDataSource,
  getRelationNames,
  useDeleteAll,
  useFindOneByKey,
} from '@modtree/repo-base'
import { getModuleRepository } from './Module'

/**
 * @param {DataSource} database
 * @returns {IDegreeRepository}
 */
export function getDegreeRepository(database?: DataSource): IDegreeRepository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(Degree)
  const deleteAll = useDeleteAll(BaseRepo)
  const findOneById = useFindOneByKey(BaseRepo, 'id')
  const findOneByTitle = useFindOneByKey(BaseRepo, 'title')
  const allRelations = getRelationNames(BaseRepo)
  const [ModuleRepository] = [getModuleRepository(db)]

  /**
   * Adds a Degree to DB
   *
   * @param {InitProps['Degree']} props
   * @returns {Promise<Degree>}
   */
  async function initialize(props: InitProps['Degree']): Promise<Degree> {
    const { moduleCodes, title } = props
    const degree = BaseRepo.create({ title })
    // find modules required, to create many-to-many relation
    const modules = await ModuleRepository.findByCodes(moduleCodes)
    degree.modules = modules
    await BaseRepo.save(degree)
    return degree
  }

  /**
   * Adds Modules to a Degree
   *
   * @param {Degree} degree
   * @param {string[]} moduleCodes
   */
  async function insertModules(
    degree: Degree,
    moduleCodes: string[]
  ): Promise<Degree> {
    // find modules to add
    return Promise.all([
      ModuleRepository.findBy({
        moduleCode: In(moduleCodes),
      }),
      findOneById(degree.id),
    ])
      .then(([newModules, loadedDegree]) => {
        copy(loadedDegree, degree)
        degree.modules.push(...newModules)
        return BaseRepo.save(degree)
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
  async function findByIds(degreeIds: string[]): Promise<Degree[]> {
    return BaseRepo.find({
      where: {
        id: In(degreeIds),
      },
      relations: allRelations,
    })
  }

  return BaseRepo.extend({
    initialize,
    insertModules,
    findOneByTitle,
    findOneById,
    findByIds,
    deleteAll,
  })
}
