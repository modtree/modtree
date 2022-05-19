import { AppDataSource, container } from '../data-source'
import { In } from 'typeorm'
import { Init, DegreeProps } from '../../types/modtree'
import { Degree } from '../entity/Degree'
import { ModuleRepository } from './Module'

const Repository = AppDataSource.getRepository(Degree)

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

export const DegreeRepository = Repository.extend({
  initialize,
  build,
})
