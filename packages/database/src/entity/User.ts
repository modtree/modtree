import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Base } from './Base'
import { Module } from './Module'
import { Degree } from './Degree'

@Entity({ name: 'user' })
export class User extends Base {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column()
    displayName: string

  @Column()
    username: string

  @Column()
    email: string

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

  @ManyToMany(() => Degree)
  @JoinTable()
    savedDegrees: Degree[]
}
