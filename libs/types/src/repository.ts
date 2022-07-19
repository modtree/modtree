export const supportedAuthProviders = ['google', 'github', 'facebook'] as const
export type AuthProvider = typeof supportedAuthProviders[number]
export type FindByKey<T> = (query: string) => Promise<T>
export type Relations = Record<string, boolean>

/**
 * types for module status
 */
export enum ModuleStatus {
  NOT_TAKEN = 'notTaken',
  DONE = 'done',
  DOING = 'doing',
}
export type ModuleState = 'placed' | 'hidden' | 'new'

/**
 * types for canTakeModules
 */
export type CanTakeModule = {
  moduleCode: string
  canTake: boolean
}
