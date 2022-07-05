import {
  IDegreeRepository,
  IGraphRepository,
  IModuleCondensedRepository,
  IModuleFullRepository,
  IModuleRepository,
  IUserRepository,
} from '@modtree/types'

export type MiniApi = {
  degreeRepo: IDegreeRepository
  userRepo: IUserRepository
  graphRepo: IGraphRepository
  moduleRepo: IModuleRepository
  moduleFullRepo: IModuleFullRepository
  moduleCondensedRepo: IModuleCondensedRepository
}
