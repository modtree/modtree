import { Module, FakeDataSource } from '@modtree/types'
import { ModuleRepository as Original } from '../repo'

const moduleFromCode = (moduleCode: string): Module => {
  return Object.assign(new Module(), { moduleCode })
}

const fetchOrFake = (code: string, data: Record<string, Module>): Module => {
  return Object.keys(data).includes(code) ? data[code] : moduleFromCode(code)
}

export class ModuleRepository extends Original {
  private fakeData: Record<string, Module>
  constructor(db: FakeDataSource) {
    super(db)
    this.fakeData = db.fakeData.module
  }

  override async findByCodes(codes: string[]): Promise<Module[]> {
    return codes.map((c) => fetchOrFake(c, this.fakeData))
  }

  override async findByCode(code: string): Promise<Module> {
    return fetchOrFake(code, this.fakeData)
  }
}
