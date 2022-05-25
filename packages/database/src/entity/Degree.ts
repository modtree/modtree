import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Base } from './Base'
import { Module } from './Module'

@Entity({ name: 'degree' })
export class Degree extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToMany(() => Module)
  @JoinTable()
  modules: Module[]

  @Column()
  title: string
}
