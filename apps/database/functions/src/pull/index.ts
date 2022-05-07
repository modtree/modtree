import { https } from 'firebase-functions'
import { db } from '../firebase'
import { DocumentReference, DocumentData } from '@google-cloud/firestore'
import { ModuleCondensed } from '../../types/nusmods'
import { getAllExistingValues } from '../classes'
import axios from 'axios'
import { nusmodsApi } from '../utils'

export const pullModuleList = https.onRequest(async (req, res) => {
  const moduleList = db.collection('moduleList')
  const already = await getAllExistingValues('moduleList', 'moduleCode')
  const result = await axios.get(nusmodsApi('moduleList'))
  const data: ModuleCondensed[] = result.data
  const stack: Promise<DocumentReference<DocumentData>>[] = []
  data
    .filter((x) => !already.exists(x.moduleCode))
    .forEach((x: ModuleCondensed) => {
      stack.push(moduleList.add(x))
    })
  await Promise.allSettled(stack)
  res.json({
    message: `Added ${stack.length} modules to database.`,
  })
})
