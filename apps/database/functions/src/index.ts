import * as functions from "firebase-functions";
import axios from "axios";
import { firestore } from "firebase-admin";
import { initializeApp } from 'firebase-admin/app'
import { DocumentData } from '@google-cloud/firestore'

initializeApp()

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const nusmodsApi = (req: string) =>
  `https://api.nusmods.com/v2/2021-2022/${req}.json`;

export const pullMod = functions.https.onRequest(async (req, res) => {
  const moduleCode = req.body.moduleCode;
  const apiRequest = nusmodsApi(`modules/${moduleCode}`);
  const result = await axios.get(apiRequest);
  const data = result.data;
  const collectionRef = firestore().collection('modules')
  await collectionRef.add(data)
  res.json({
    result: data,
  });
});

export const getMod = functions.https.onRequest(async (req, res) => {
  const search: Record<string, string> = req.body

  const collectionRef = firestore().collection('modules')
  // const q = firestore().collection('modules').where('acadYear', "==", '2021/2022').where().where()

  const arr = Object.entries(search)
  let query = collectionRef.where(arr[0][0], '==', arr[0][1])

  for (let i = 1; i < arr.length; i++) {
    query = query.where(arr[i][0] , "==", arr[i][1])
  }

  const snapshot = await query.get()

  const result: DocumentData[] = []
  snapshot.forEach(doc => {
    const data = doc.data()
    result.push(data)
  })

  res.json({
    result,
  });
});
