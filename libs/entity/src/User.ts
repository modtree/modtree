import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { IDegree, IGraph, IModule, IUser } from '@modtree/types'

@Entity({ name: 'user' })
/** User entity */
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column()
    displayName: string

  @Column()
    username: string

  @Column()
    email: string

  @ManyToMany('Module', 'user')
  @JoinTable()
    modulesDone: IModule[]

  @ManyToMany('Module', 'user')
  @JoinTable()
    modulesDoing: IModule[]

  @Column()
    matriculationYear: number

  @Column()
    graduationYear: number

  @Column()
    graduationSemester: number

  @ManyToMany('Degree', 'user')
  @JoinTable()
    savedDegrees: IDegree[]

  @ManyToMany('Graph', 'user')
  @JoinTable()
    savedGraphs: IGraph[]
}
