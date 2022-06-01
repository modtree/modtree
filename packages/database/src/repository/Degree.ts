import { DataSource, In } from 'typeorm'
import { Init } from '../../types/entity'
import { Degree } from '../entity/Degree'
import { ModuleRepository } from './Module'
import { getDataSource, useLoadRelations, getRelationNames } from './base'
import { copy } from '../utils/object'
import type { DegreeRepository as Repository } from '../../types/repository'

/**
 * @param {DataSource} database
 * @return {DegreeRepository}
 */
export function DegreeRepository(database?: DataSource): Repository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(Degree)
  const loadRelations = useLoadRelations(BaseRepo)

  /**
   * Adds a Degree to DB
   * @param {DegreeInitProps} props
   * @return {Promise<Degree>}
   */
  async function initialize(props: Init.DegreeProps): Promise<Degree> {
    const { moduleCodes, title } = props
    // find modules required, to create many-to-many relation
    const modules = await ModuleRepository(db).findByCodes(moduleCodes)
    const degree = BaseRepo.create({ modules, title })
    await BaseRepo.save(degree)
    return degree
  }

  /**
   * Adds Modules to a Degree
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
    await DegreeRepository(db).loadRelations(degree, {
      modules: true,
    })
    // update the degree
    degree.modules.push(...newModules)
    const updatedDegree = await BaseRepo.save(degree)
    // update the passed object
    copy(updatedDegree, degree)
  }

  /**
   * @param {string} title
   * @return {Promise<Degree>}
   */
  async function findOneByTitle(title: string): Promise<Degree> {
    return BaseRepo.createQueryBuilder('degree')
      .where('degree.title = :title', { title })
      .leftJoinAndSelect('degree.modules', 'module')
      .getOneOrFail()
  }

  /**
   * Returns a Degree with all relations loaded
   * @param {string} id
   * @return {Promise<Degree>}
   */
  async function findOneById(id: string): Promise<Degree> {
    // get user by id
    const degree = await BaseRepo.createQueryBuilder('degree')
      .where('degree.id = :id', { id })
      .getOneOrFail()
    // get relation names
    const relationNames = getRelationNames(db, Degree)
    await DegreeRepository(db).loadRelations(degree, relationNames)
    return degree
  }

  return BaseRepo.extend({
    initialize,
    insertModules,
    loadRelations,
    findOneByTitle,
    findOneById,
  })
}
