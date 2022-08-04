import { Module, FakeDataSource, IFakeData } from '@modtree/types'
import { validModuleCode } from '@modtree/utils'
import { ModuleRepository as Original } from '../repo'

export class ModuleRepository extends Original {
  private fakeData: IFakeData
  private findModuleByCode: (_: string) => Module
  constructor(db: FakeDataSource) {
    super(db)
    this.fakeData = db.fakeData
    this.findModuleByCode = this.fakeData.findModuleByCode.bind(this.fakeData)
  }

  override async findByCodes(codes: string[]): Promise<Module[]> {
    return codes.filter(validModuleCode).map(this.findModuleByCode)
  }

  override async findByCode(code: string): Promise<Module> {
    if (!validModuleCode(code)) throw new Error('Invalid module code')
    return this.findModuleByCode(code)
  }
}
