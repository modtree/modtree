import { Degree } from '../entity-repo/Degree'
import { AppDataSource, container } from '../data-source'
import { DegreeInitProps, DegreeProps } from '../../types/modtree'
import { ModuleRepository } from './Module'
import { In } from 'typeorm'
import { log } from '../cli'

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
  degree.modulesRequired = props.modulesRequired || []
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
    const modulesRequired = await ModuleRepository.find({
      where: {
        moduleCode: In(props.moduleCodes),
      },
    })
    const degreeProps = {
      modulesRequired,
      title: props.title,
    }
    const degree = build(degreeProps)
    await DegreeRepository.save(degree)
  })
}

/**
 * get one Degree in DB
 * @param {string} title
 * @return {Promise<Degree>}
 * @throws {Error}
 */
async function getOne(title: string): Promise<Degree> {
  const degree = await container(async () => {
    const repo = AppDataSource.getRepository(Degree)
    const degree = await repo
      .findOne({
        where: {
          title,
        },
        relations: ['modulesRequired'],
      })
      .catch((err) => {
        log.warn('Warning: failed to getOne Degree from database.')
        console.log(err)
      })
    return degree
  })
  if (!degree) throw new Error('Failed to getOne Degree')
  return degree
}

/**
 * get all Degrees in DB
 * @return {Promise<Degree[]>}
 */
async function get(): Promise<Degree[]> {
  const degrees = await container(async () => {
    const degrees = await DegreeRepository.find({
      relations: ['modulesRequired'],
    }).catch((err) => {
      log.warn('Warning: failed to get Degrees from database.')
      console.log(err)
    })
    return degrees
  })

  return !degrees ? [] : degrees
}

export const DegreeRepository = Repository.extend({
  get,
  getOne,
  initialize,
  build
})
