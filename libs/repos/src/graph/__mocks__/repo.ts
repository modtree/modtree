import { Graph, FakeDataSource, IFakeData } from '@modtree/types'
import { GraphRepository as Original } from '../repo'

export class GraphRepository extends Original {
  private fakeData: IFakeData
  constructor(db: FakeDataSource) {
    super(db)
    this.fakeData = db.fakeData
  }

  override findOneById(id: string): Promise<Graph> {
    return new Promise((resolve, reject) => {
      const result = this.fakeData.graphs.find((g) => g.id === id)
      if (!result) {
        reject()
      } else {
        resolve(result)
      }
    })
  }
}
