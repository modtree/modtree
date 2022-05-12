import { container, AppDataSource } from '../data-source'
import { Degree, Module } from '../entity'
import { In } from 'typeorm'

export const addDegree = async() => {
  const moduleCodes = [
    "CS1101S", "CS1231S", "CS2030S", "CS2040S",
    "CS2100", "CS2103T", "CS2106", "CS2109S", "CS3230",
  ]

  let modulesRequired = []
  await container(async() => {
    // find modules required
    // to create many-to-many relation
    const repo = AppDataSource.getRepository(Module)
    modulesRequired = await repo.find({
      where: {
        moduleCode: In(moduleCodes)
      }
    })

    const degree = new Degree()
    degree.title = "Computer Science"
    degree.modulesRequired = modulesRequired
    await AppDataSource.manager.save(degree)
  })
}
