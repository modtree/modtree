import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Module } from './Module'

@Entity({ name: 'degree' })
export class Degree {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @ManyToMany(() => Module)
  @JoinTable()
  modules: Module[]

  @Column()
  title: string
}
