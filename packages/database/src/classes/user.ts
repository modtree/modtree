import { User as UserEntity } from '../entity'

/** User class */
export class User {
  user: UserEntity
  /** User constructor */
  public constructor() {
    this.user = new UserEntity()
  }
  /**
   * sets entity displayName
   * @param {string} displayName
   */
  setDisplayName(displayName: string) {
    this.user.displayName = displayName
  }
}
