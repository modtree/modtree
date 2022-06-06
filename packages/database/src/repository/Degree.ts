import { DataSource, In } from 'typeorm'
import type { InitProps } from '../../types/init-props'
import { Degree } from '../entity/Degree'
import { ModuleRepository } from './Module'
import { getDataSource, getRelationNames, useDeleteAll } from './base'
import { copy } from '../utils'
import type { IDegreeRepository } from '../../types/repository'

/**
 * @param {DataSource} database
 * @returns {DegreeRepository}
 */
export function DegreeRepository(database?: DataSource): IDegreeRepository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(Degree)
  const allRelations = getRelationNames(BaseRepo)
  const deleteAll = useDeleteAll(BaseRepo)

  /**
   * Returns a Degree with all relations loaded
   *
   * @param {string} id
   * @returns {Promise<Degree>}
   */
  async function findOneById(id: string): Promise<Degree> {
    return BaseRepo.findOneOrFail({
      where: { id },
      relations: allRelations,
    })
  }

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
    const modules = await ModuleRepository(db).findByCodes(moduleCodes)
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
  ): Promise<void> {
    // find modules to add
    const newModules = await ModuleRepository(db).findBy({
      moduleCode: In(moduleCodes),
    })
    // find modules part of current degree
    copy(await findOneById(degree.id), degree)
    // update the degree
    degree.modules.push(...newModules)
    const updatedDegree = await BaseRepo.save(degree)
    // update the passed object
    copy(updatedDegree, degree)
  }

  /**
   * @param {string} title
   * @returns {Promise<Degree>}
   */
  async function findOneByTitle(title: string): Promise<Degree> {
    return BaseRepo.createQueryBuilder('degree')
      .where('degree.title = :title', { title })
      .leftJoinAndSelect('degree.modules', 'module')
      .getOneOrFail()
  }

  /**
   * @param {string[]} degreeIds
   * @returns {Promise<Degree[]>}
   */
  async function findByIds(degreeIds: string[]): Promise<Degree[]> {
    if (degreeIds.length === 0) {
      return []
    }
    return BaseRepo.createQueryBuilder('degree')
      .where('degree.id IN (:...degreeIds)', { degreeIds })
      .leftJoinAndSelect('degree.modules', 'module')
      .getMany()
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
