import * as functions from "firebase-functions";
import axios from "axios";
import { firestore } from "firebase-admin";
import { initializeApp } from 'firebase-admin/app'

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
