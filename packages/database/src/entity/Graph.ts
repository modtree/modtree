import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { IDegree, IGraph, IModule, IUser } from './types'

@Entity({ name: 'graph' })
/** Graph entity */
export class Graph implements IGraph {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne('User', 'graph')
  @JoinTable()
  user: IUser

  @ManyToOne('Degree', 'graph')
  @JoinTable()
  degree: IDegree

  @ManyToMany('Module', 'graph')
  @JoinTable()
  modulesPlaced: IModule[]

  @ManyToMany('Module', 'graph')
  @JoinTable()
  modulesHidden: IModule[]
}
