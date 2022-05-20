import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Module } from './Module'

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  displayName: string

  @Column()
  username: string

  @ManyToMany(() => Module)
  @JoinTable()
  modulesDone: Module[]

  @ManyToMany(() => Module)
  @JoinTable()
  modulesDoing: Module[]

  @Column()
  matriculationYear: number

  @Column()
  graduationYear: number

  @Column()
  graduationSemester: number
}
