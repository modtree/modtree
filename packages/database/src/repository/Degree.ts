import { container } from '../data-source'
import { DataSource, In, Repository } from 'typeorm'
import { Init, DegreeProps } from '../../types/modtree'
import { Degree } from '../entity/Degree'
import { ModuleRepository } from './Module'
import {
  getDataSource,
  LoadRelations,
  useBuild,
  useLoadRelations,
} from './base'
import { copy } from '../utils/object'

interface DegreeRepository extends Repository<Degree> {
  build(props: DegreeProps): Degree
  initialize(props: Init.DegreeProps): Promise<void>
  insertModules(degree: Degree, moduleCodes: string[]): Promise<void>
  loadRelations: LoadRelations<Degree>
  findOneByTitle(title: string): Promise<Degree>
}

/**
 * @param {DataSource} database
 * @return {DegreeRepository}
 */
export function DegreeRepository(database?: DataSource): DegreeRepository {
  const db = getDataSource(database)
  const BaseRepo = db.getRepository(Degree)
  const loadRelations = useLoadRelations(BaseRepo)

  /**
   * Constructor for Degree
   * Note: the props here is slightly different from Init.DegreeProps
   * @param {DegreeProps} props
   * @return {Degree}
   */
  function build(props: DegreeProps): Degree {
    return useBuild(db, Degree, props)
  }

  /**
   * Adds a Degree to DB
   * @param {DegreeInitProps} props
   * @return {Promise<void>}
   */
  async function initialize(props: Init.DegreeProps): Promise<void> {
    const { moduleCodes, title } = props
    await container(db, async () => {
      // find modules required, to create many-to-many relation
      const modules = await ModuleRepository(db).findByCodes(moduleCodes)
      const degree = build({ modules, title })
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
      const newModules = await ModuleRepository(db).findBy({
        moduleCode: In(moduleCodes),
      })
      // find modules part of current degree
      const updatedDegree = await BaseRepo.findOne({
        where: {
          id: degree.id,
        },
        relations: { modules: true },
      }).then(async (degree) => {
        degree.modules.push(...newModules)
        await BaseRepo.save(degree)
        return degree
      })
      // update the passed object
      copy(updatedDegree, degree)
    })
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

  return BaseRepo.extend({
    build,
    initialize,
    insertModules,
    loadRelations,
    findOneByTitle,
  })
}
