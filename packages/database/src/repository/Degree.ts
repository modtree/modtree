import { AppDataSource, container } from '../data-source'
import { In } from 'typeorm'
import { Init, DegreeProps } from '../../types/modtree'
import { Degree } from '../entity/Degree'
import { ModuleRepository } from './Module'

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
  await container(async () => {
    // find modules required, to create many-to-many relation
    const modules = await ModuleRepository.find({
      where: {
        moduleCode: In(props.moduleCodes),
      },
    })
    const degreeProps = {
      modules,
      title: props.title,
    }
    const degree = build(degreeProps)
    await DegreeRepository.save(degree)
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
  await container(async () => {
    // find modules to add
    const newModules = await ModuleRepository.find({
      where: {
        moduleCode: In(moduleCodes),
      },
    })
    // find modules part of current degree
    await DegreeRepository.findOne({
      where: {
        id: degree.id,
      },
      relations: ['modules'],
    }).then(async (degree) => {
      degree.modules.push(...newModules)
      await DegreeRepository.save(degree)
    })
  })
}

const BaseRepo = AppDataSource.getRepository(Degree)
export const DegreeRepository = BaseRepo.extend({
  initialize,
  build,
  insertModules,
})
