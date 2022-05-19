import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { container } from '../data-source'

import { User, Degree, Module } from '.'
import { ModuleRepository } from '../repository/Module'
import { DAGRepository } from '../repository/DAG'

@Entity({ name: 'DAG' })
export class DAG {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @ManyToOne(() => User)
  @JoinTable()
  user: User

  @ManyToOne(() => Degree)
  @JoinTable()
  degree: Degree

  @ManyToMany(() => Module)
  @JoinTable()
  modulesPlaced: Module[]

  @ManyToMany(() => Module)
  @JoinTable()
  modulesHidden: Module[]
}
