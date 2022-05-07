import { firestore } from 'firebase-admin'
import { Module } from '../../types/nusmods'
import { converter } from '../utils'

/**
 * Add moduleNumber parameter to each module in "modules" collection
 */
export const addModuleNumber = async (): Promise<string> => {
  // get all data
  const collectionRef = firestore()
    .collection('modules')
    .withConverter(converter.nusmodsModule)
  const snapshot = await collectionRef.get()

  await Promise.all(
    snapshot.docs.map(async (doc) => {
      const id = doc.id
      const module: Module = doc.data()
      return await collectionRef
        .doc(id)
        .update({ moduleNumber: module.moduleCode.replace(/[^0-9]/g, '') })
    })
  )

  return 'done'
}
