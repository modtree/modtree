import { Degree, FakeDataSource, IFakeData } from '@modtree/types'
import { DegreeRepository as Original } from '../repo'

export class DegreeRepository extends Original {
  private fakeData: IFakeData
  constructor(db: FakeDataSource) {
    super(db)
    this.fakeData = db.fakeData
  }

  override findOneById(id: string): Promise<Degree> {
    return new Promise((resolve, reject) => {
      const result = this.fakeData.degrees.find((d) => d.id === id)
      if (!result) {
        reject()
      } else {
        resolve(result)
      }
    })
  }
}
