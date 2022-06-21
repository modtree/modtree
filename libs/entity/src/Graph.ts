import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Column,
} from 'typeorm'
import type { IDegree, IGraph, IModule, IUser } from '@modtree/types'
import type { Node, Edge } from 'react-flow-renderer'

@Entity({ name: 'graph' })
/** Graph entity */
export class Graph implements IGraph {
  @PrimaryGeneratedColumn('uuid')
  id: string

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
  flowNodes: Node[]

  @Column('json', { default: [] })
  flowEdges: Edge[]
}
