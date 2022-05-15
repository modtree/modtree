import { AppDataSource } from '../data-source'
import { Module } from '../entity/Module'

export const ModuleRepository = AppDataSource.getRepository(Module).extend({
  findByFaculty(faculty: string): Promise<Module[]> {
    return this.createQueryBuilder('module')
      .where('module.faculty = :faculty', { faculty })
      .getMany()
  },
  gottem() {
    console.log('gottem')
  }
})
