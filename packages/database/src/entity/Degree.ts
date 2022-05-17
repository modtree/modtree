import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Module } from './Module'
import { container } from '../data-source'
import { In } from 'typeorm'
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
        console.log('before', degree.modules.map(x => x.moduleCode))
        degree.modules.push(...newModules)
        await DegreeRepository.save(degree)
      })

      // 1. query builder
      // - many to many error
      /*
      await DegreeRepository
        .createQueryBuilder()
        .update(Degree)
        .set({
          modules,
        })
        .where("id = :id", {id: this.id})
        .execute()
        */

      // 2. delete and save
      // - delete not working
      // await DegreeRepository.delete(this.id)
      // await DegreeRepository.delete({
      //   id: degree.id
      // })
      // await DegreeRepository.save(degree)
      //
      // modules.forEach((one: Module) => {
      //   degree.modules.push(one)
      // })
      // 3. update
      // - many to many error
      // await DegreeRepository.update(this.id, degree)

      // 4. save
      // - duplicate degree
      // await DegreeRepository.save(degree)

      // 5. save and delete
      // - delete not working
      // await DegreeRepository.save(degree)
      // await DegreeRepository.delete(this.id)

      // 6. extend base entity and save
      // await degree.save()

      // 7. dont delete just get latest (will require a new created_at column)
      // await DegreeRepository.save(degree)
    })
  }
}
