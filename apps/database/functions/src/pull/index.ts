import { https } from 'firebase-functions'
import { db } from '../firebase'
import { DocumentReference, DocumentData } from '@google-cloud/firestore'
import { ModuleCondensed } from '../../types/nusmods'
import { getAllExistingValues } from '../classes'
import axios, { AxiosResponse } from 'axios'
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

export const pullAllModules = https.onRequest(async (req, res) => {
  const collectionRef = db.collection('modules2')
  const snapshot = await db.collection('moduleList').get()
  const already = await getAllExistingValues('modules2', 'moduleCode')
  const condensedModules = snapshot.docs
    .map((doc) => doc.data().moduleCode)
    .filter((x) => !already.exists(x))

  console.log(`fetching ${condensedModules.length} new modules`)

  const apiEndpoints = condensedModules.map((m) => nusmodsApi(`modules/${m}`))
  var added = 0

  const q: Promise<AxiosResponse<any, any>>[] = []
  for (let i = 0; i < 300; i++) {
    q.push(axios.get(apiEndpoints[i]))
  }

  const f = await Promise.allSettled(q)
  const write: Promise<DocumentReference<DocumentData>>[] = []
  f.forEach((x) => {
    if (x.status === 'fulfilled') {
      write.push(collectionRef.add(x.value.data))
      console.log(`writing ${x.value.data.moduleCode}...`)
      added += 1
    }
  })
  await Promise.allSettled(write)

  res.json({
    message: `Added ${added} modules to database.`,
  })
})

// export const pullMod = https.onRequest(async (req, res) => {
//   const moduleCode = req.body.moduleCode
//   const apiRequest = nusmodsApi(`modules/${moduleCode}`)
//   const result = await axios.get(apiRequest)
//   const data = result.data
//   const collectionRef = db.collection('modules')
//   await collectionRef.add(data)
//   res.json({
//     result: data,
//   })
// })
