import { container, AppDataSource } from '../data-source'
import { Degree } from '../entity'

/**
 * Adds a Degree to DB
 */
export async function add() {
  const props = {
    moduleCodes: [
      'CS1101S',
      'CS1231S',
      'CS2030S',
      'CS2040S',
      'CS2100',
      'CS2103T',
      'CS2106',
      'CS2109S',
      'CS3230',
    ],
    title: 'Computer Science'
  }

  await Degree.add(props)
}

/**
 * Gets one Degree from DB
 */
export async function getOne() {
  await container(async () => {
    const repo = AppDataSource.getRepository(Degree)
    const degree = await repo.findOne({
      where: {
        title: 'Computer Science',
      },
      relations: ['modulesRequired'],
    })

    console.log('Degree:', degree.title) // overall structure
    const moduleCodes = degree.modulesRequired.map((one) => one.moduleCode)
    console.log(moduleCodes)
  })
}
