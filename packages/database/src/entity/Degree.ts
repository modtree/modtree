import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  In,
  FindOptionsRelations,
} from 'typeorm'
import { container } from '../data-source'
import { Module } from './Module'
import { ModuleRepository } from '../repository/Module'
import { DegreeRepository } from '../repository/Degree'
import { BaseEntity } from '../base/entity'

@Entity({ name: 'degree' })
export class Degree extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @ManyToMany(() => Module)
  @JoinTable()
  modules: Module[]

  @Column()
  title: string

  /**
   * retrieve own relations
   *
   * @param {FindOptionsRelations<Degree>} relations
   */
  async loadRelations(relations: FindOptionsRelations<Degree>) {
    await super.loadRelations(relations, DegreeRepository)
  }

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
      // load relations
      await this.loadRelations({ modules: true })
      // append new modules
      this.modules.push(...newModules)
      await DegreeRepository.save(this)
    })
  }
}
