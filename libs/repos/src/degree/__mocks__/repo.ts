import { Degree, FakeDataSource, IFakeData } from '@modtree/types'
import { DegreeRepository as Original } from '../repo'

export class DegreeRepository extends Original {
  private fakeData: IFakeData
  constructor(db: FakeDataSource) {
    super(db)
    this.fakeData = db.fakeData
  }

  private findDegreeById(id: string): Degree {
    const result = this.fakeData.degrees.find((d) => d.id === id)
    if (!result) return this.fakeData.create(Degree)
    return result
  }

  override findOneById = async (id: string) =>
    this.findOneOrFail({ where: { id }, relations: this.relations })
  //
  // override findOneByTitle = async (title: string) =>
  //   this.findOneOrFail({ where: { title }, relations: this.relations })
  // /**
  //  * @param {string[]} degreeIds
  //  * @returns {Promise<Degree[]>}
  //  */
  // override async findByIds(degreeIds: string[]): Promise<Degree[]> {
  //   return this.find({
  //     where: {
  //       id: In(degreeIds),
  //     },
  //     relations: this.relations,
  //   })
  // }
}
