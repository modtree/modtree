import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { IDegree, IModule } from './types'

@Entity({ name: 'degree' })
/** Degree entity */
export class Degree implements IDegree {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToMany('Module', 'degree')
  @JoinTable()
  modules: IModule[]

  @Column()
  title: string
}
