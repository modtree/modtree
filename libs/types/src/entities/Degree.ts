import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import type { IDegree, IModule } from './interface'

@Entity({ name: 'degree' })
/** Degree entity */
export class Degree implements IDegree {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToMany('Module', 'degree')
  @JoinTable()
  modules: IModule[]

  @Column('character varying')
  title: string
}
