import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm'
import type { IDegree, IGraph, IModule, IUser } from '@modtree/types'

@Entity({ name: 'user' })
/** User entity */
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @PrimaryColumn('text', { default: '' })
  authZeroId: string

  @Column('character varying')
  displayName: string

  @Column('character varying')
  username: string

  @Column('character varying')
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
  mainDegree: IDegree

  @ManyToOne('Graph', 'user')
  @JoinTable()
  mainGraph: IGraph
}
