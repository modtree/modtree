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

  @Column('varchar', { default: '' })
  googleId: string

  @Column('varchar', { default: '' })
  facebookId: string

  @Column('varchar', { default: '' })
  githubId: string

  @Column('varchar', { default: '' })
  authZeroId: string

  @Column('varchar', { default: '' })
  displayName: string

  @Column('varchar', { default: '' })
  username: string

  @Column('varchar', { default: '' })
  email: string

  @ManyToMany('Module', 'user')
  @JoinTable()
  modulesDone: IModule[]

  @ManyToMany('Module', 'user')
  @JoinTable()
  modulesDoing: IModule[]

  @Column('integer', { default: 0 })
  matriculationYear: number

  @Column('integer', { default: 0 })
  graduationYear: number

  @Column('integer', { default: 0 })
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
