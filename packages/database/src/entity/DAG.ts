import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { User } from './User'
import { Degree } from './Degree'
import { Module } from './Module'

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
