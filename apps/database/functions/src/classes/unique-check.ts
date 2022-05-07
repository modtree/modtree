import { firestore } from 'firebase-admin'

/**
 * a UniquenessChecker class
 */
export class UniquenessChecker<T extends string | number | symbol> {
  database: Partial<Record<T, boolean>>

  /**
   * constructor for UniquessChecker
   */
  constructor() {
    this.database = {}
  }

  /**
   * get
   *
   * @param {T} key
   * @param {T} defaultValue
   * @return {T}
   */
  get(key: T, defaultValue: T): T | Partial<Record<T, boolean>>[T] {
    return key in this.database ? this.database[key] : defaultValue
  }

  /**
   * exists
   *
   * @param {T} key
   * @return {boolean}
   */
  exists(key: T): boolean {
    return key in this.database
  }

  /**
   * push
   *
   * @param {T} key
   * @return {boolean}
   */
  push(key: T): boolean {
    if (!(key in this.database)) {
      this.database[key] = true
      return true
    }
    return false
  }
}

/**
 * searches all documents in {collection} and
 * retrives all values of {field}
 * @param {string} collection
 * @param {string} field
 * @return {UniquenessChecker<string>}
 */
export async function getAllExistingValues(
  collection: string,
  field: string
): Promise<UniquenessChecker<string>> {
  const result = new UniquenessChecker<string>()
  const snapshot = await firestore().collection(collection).get()
  snapshot.forEach((doc) => {
    const value = doc.data()[field]
    result.push(value)
  })
  return result
}
