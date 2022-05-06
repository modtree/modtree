import {https} from 'firebase-functions';
import axios from 'axios';
import {firestore} from 'firebase-admin';
import {initializeApp} from 'firebase-admin/app';
import {DocumentData} from '@google-cloud/firestore';
import {utils} from './utils';
export * from './test';

initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const nusmodsApi = (req: string) =>
  `https://api.nusmods.com/v2/2021-2022/${req}.json`;

export const pullMod = https.onRequest(async (req, res) => {
  const moduleCode = req.body.moduleCode;
  const apiRequest = nusmodsApi(`modules/${moduleCode}`);
  const result = await axios.get(apiRequest);
  const data = result.data;
  const collectionRef = firestore().collection('modules');
  await collectionRef.add(data);
  res.json({
    result: data,
  });
});

export const apiMod = https.onRequest(async (req, res) => {
  const moduleCode = req.body.moduleCode;
  const apiRequest = nusmodsApi(`modules/${moduleCode}`);
  const result = await axios.get(apiRequest);
  const data = result.data;
  console.log(data);
  res.json({
    result: data,
  });
});

export const numberMods = https.onRequest(async (req, res) => {
  const collectionRef = firestore().collection('modules');
  const length = await collectionRef.listDocuments();
  res.json({
    length: length.length,
  });
});

export const getMod = https.onRequest(async (req, res) => {
  const search: Record<string, string> = req.body;
  const collectionRef = firestore().collection('modules');
  // const q = firestore().collection('modules').where('acadYear', "==", '2021/2022').where().where()
  const arr = Object.entries(search);
  let query = collectionRef.where(arr[0][0], '==', arr[0][1]);
  for (let i = 1; i < arr.length; i++) {
    query = query.where(arr[i][0], '==', arr[i][1]);
  }
  const snapshot = await query.get();
  const result: DocumentData[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    console.log('get mod', data);
    result.push(data);
  });
  res.json({
    result,
  });
});

export const getTree = https.onRequest(async (req, res) => {
  const module = await utils.getMod(req.body);
  const tree = module.prereqTree || {};
  console.log(JSON.stringify(tree, null, 2));
  res.json({
    tree,
  });
});
