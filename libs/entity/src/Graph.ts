import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Column,
} from 'typeorm'
import type {
  FlowEdgeCondensed,
  FlowNodeCondensed,
  IDegree,
  IGraph,
  IModule,
  IUser,
} from '@modtree/types'

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

  @Column('json', { nullable: true })
  flowNodes: FlowNodeCondensed[]

  @Column('json', { nullable: true })
  flowEdges: FlowEdgeCondensed[]
}
