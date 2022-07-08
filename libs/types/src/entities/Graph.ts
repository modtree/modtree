import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Column,
} from 'typeorm'
import type {
  GraphFlowEdge,
  GraphFlowNode,
  IDegree,
  IGraph,
  IModule,
  IUser,
} from './interface'

@Entity({ name: 'graph' })
/** Graph entity */
export class Graph implements IGraph {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('character varying', { default: 'graph' })
  title: string

  @ManyToOne('User', 'graph', { onDelete: 'CASCADE' })
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
  flowNodes: GraphFlowNode[]

  @Column('json', { default: [] })
  flowEdges: GraphFlowEdge[]
}
