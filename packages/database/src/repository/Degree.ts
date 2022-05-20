import { container } from '../data-source'
import { DataSource, In, Repository } from 'typeorm'
import { Init, DegreeProps } from '../../types/modtree'
import { Degree } from '../entity/Degree'
import { ModuleRepository } from './Module'
import { db as DefaultSource } from '../config'

interface DegreeRepository extends Repository<Degree> {
  build(props: DegreeProps): Degree
  initialize(props: Init.DegreeProps): Promise<void>
  insertModules(degree: Degree, moduleCodes: string[]): Promise<void>
}

/**
 * @param {DataSource} database
 * @return {DegreeRepository}
 */
export function DegreeRepository(database?: DataSource): DegreeRepository {
  const db = database || DefaultSource
  const BaseRepo = db.getRepository(Degree)

  /**
   * Constructor for Degree
   * Note: the props here is slightly different from Init.DegreeProps
   * @param {DegreeProps} props
   * @return {Degree}
   */
  function build(props: DegreeProps): Degree {
    const degree = new Degree()
    degree.title = props.title || ''
    degree.modules = props.modules || []
    return degree
  }

  /**
   * Adds a Degree to DB
   * @param {DegreeInitProps} props
   * @return {Promise<void>}
   */
  async function initialize(props: Init.DegreeProps): Promise<void> {
    await container(db, async () => {
      // find modules required, to create many-to-many relation
      const modules = await ModuleRepository(db).find({
        where: {
          moduleCode: In(props.moduleCodes),
        },
      })
      const degreeProps = {
        modules,
        title: props.title,
      }
      const degree = build(degreeProps)
      await BaseRepo.save(degree)
    })
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
    await container(db, async () => {
      // find modules to add
      const newModules = await ModuleRepository(db).find({
        where: {
          moduleCode: In(moduleCodes),
        },
      })
      // find modules part of current degree
      await BaseRepo.findOne({
        where: {
          id: degree.id,
        },
        relations: ['modules'],
      }).then(async (degree) => {
        degree.modules.push(...newModules)
        await BaseRepo.save(degree)
      })
      // update the passed object
      degree.modules.push(...newModules)
    })
  }

  return BaseRepo.extend({
    build,
    initialize,
    insertModules,
  })
}
