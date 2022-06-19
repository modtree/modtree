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

  @ManyToOne('Degree', 'graph', { onDelete: 'CASCADE' })
  @JoinTable()
  degree: IDegree

  @ManyToMany('Module', 'graph')
  @JoinTable()
  modulesPlaced: IModule[]

  @ManyToMany('Module', 'graph')
  @JoinTable()
  modulesHidden: IModule[]

  @Column('json', { default: [] })
  flowNodes: FlowNodeCondensed[]

  @Column('json', { default: [] })
  flowEdges: FlowEdgeCondensed[]
}
