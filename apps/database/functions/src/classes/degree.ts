import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { FirestoreDataConverter } from '@google-cloud/firestore'
import { Module, PrereqTree } from '../../types/nusmods'
import { utils } from '../utils'

/** a Degree class */
export class Degree {
  hardRequirements: string[]
  name: string
  static converter: FirestoreDataConverter<Degree> = {
    toFirestore: (degree: Degree) => {
      return {
        name: degree.name,
        hardRequirements: degree.hardRequirements,
      }
    },
    fromFirestore: (snapshot) => {
      const data = snapshot.data()
      return new Degree(data.name, data.hardRequirements)
    },
  }
  static empty = new Degree('', [])
  /**
   * create a Degree
   * @param {string} name
   * @param {string[]} hardRequirements
   */
  constructor(name: string, hardRequirements: string[]) {
    this.name = name
    this.hardRequirements = hardRequirements
  }
  /**
   * get list of hard requirements to graduate
   * @return {string[]}
   */
  getHardRequirements(): string[] {
    return this.hardRequirements
  }
}

export const initDegree = https.onRequest(async (req, res) => {
  const collectionRef = firestore()
    .collection('degrees')
    .withConverter(Degree.converter)
  const degree = new Degree('Computer Science', [
    'CS1101S',
    'CS1231S',
    'CS2030S',
    'CS2040S',
  ])
  await collectionRef.add(degree)
  res.json({
    message: 'created degree',
  })
})

export const getDegree = https.onRequest(async (req, res) => {
  const collectionRef = firestore().collection('degrees')
  const query = collectionRef.where('name', '==', 'Computer Science')
  const snapshot = await query.withConverter(Degree.converter).get()

  const result: Degree[] = []

  snapshot.forEach((doc) => {
    const data: Degree = doc.data()
    result.push(data)
  })

  if (result.length === 0) {
    res.json({
      message: 'no degree found',
    })
    return
  }

  const one: Degree = result[0]
  const tree: PrereqTree[] = []

  const awaitStack: Promise<Module>[] = []

  one.hardRequirements.forEach((mod) => {
    awaitStack.push(utils.getMod({ moduleCode: mod }))
  })

  const data: PromiseSettledResult<Module>[] = await Promise.allSettled(
    awaitStack
  )

  data.forEach((moduleResult) => {
    if (moduleResult.status === 'fulfilled') {
      // tree.push(moduleResult.value[0].prereqTree || []);
      tree.push(moduleResult.value.prereqTree || '')
    }
  })

  res.json({
    tree,
  })
})
