import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm'
import type { IDegree, IGraph, IModule, IUser } from './interface'

@Entity({ name: 'user' })
/** User entity */
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  googleId: string

  @Column('varchar')
  authZeroId: string

  @Column('varchar')
  displayName: string

  @Column('varchar')
  username: string

  @Column('varchar')
  email: string

  @ManyToMany('Module', 'user')
  @JoinTable()
  modulesDone: IModule[]

  @ManyToMany('Module', 'user')
  @JoinTable()
  modulesDoing: IModule[]

  @Column('integer')
  matriculationYear: number

  @Column('integer')
  graduationYear: number

  @Column('integer')
  graduationSemester: number

  @ManyToMany('Degree', 'user')
  @JoinTable()
  savedDegrees: IDegree[]

  @ManyToMany('Graph', 'user')
  @JoinTable()
  savedGraphs: IGraph[]

  @ManyToOne('Degree', 'user')
  @JoinTable()
  mainDegree?: IDegree

  @ManyToOne('Graph', 'user')
  @JoinTable()
  mainGraph?: IGraph
}
