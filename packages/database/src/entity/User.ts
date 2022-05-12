import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  displayName: string

  @Column()
  username: string

  @Column({ type: 'json' })
  modulesCompleted: string[]

  @Column({ type: 'json' })
  modulesDoing: string[]

  @Column()
  matriculationYear: number

  @Column()
  graduationYear: number

  @Column()
  graduationSemester: number

  async canTakeModule(moduleCode: string): Promise<boolean> {
    // TODO make this take a Module instead of a string
    console.log(`checking if user can take ${moduleCode}...`)
    return true
  }
}
