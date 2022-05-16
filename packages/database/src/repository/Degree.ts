import { Degree } from '../entity/Degree'
import { AppDataSource, container } from '../data-source'
import { DegreeInitProps, DegreeProps } from '../../types/modtree'
import { ModuleRepository } from './Module'
import { In } from 'typeorm'

const Repository = AppDataSource.getRepository(Degree)

/**
 * Constructor for Degree
 * Note: the props here is slightly different from DegreeInitProps
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
async function initialize(props: DegreeInitProps): Promise<void> {
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
