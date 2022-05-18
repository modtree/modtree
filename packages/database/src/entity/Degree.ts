import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  In,
} from 'typeorm'
import { container } from '../data-source'

import { Module } from './Module'
import { DegreeRepository } from '../repository/Degree'
import { ModuleRepository } from '../repository/Module'

@Entity({ name: 'degree' })
export class Degree {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @ManyToMany(() => Module)
  @JoinTable()
  modules: Module[]

  @Column()
  title: string

  /**
   * Adds Modules to a Degree
   * @param {string[]} moduleCodes
   */
  async insertModules(moduleCodes: string[]): Promise<void> {
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
          id: this.id,
        },
        relations: ['modules'],
      }).then(async (degree) => {
        degree.modules.push(...newModules)
        await DegreeRepository.save(degree)
      })
    })
  }
}
