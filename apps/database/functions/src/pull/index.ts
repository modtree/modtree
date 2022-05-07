// import { User, Degree } from "../classes";
import { https } from "firebase-functions";
import { firestore } from "firebase-admin";
import { DocumentReference, DocumentData } from "@google-cloud/firestore";
import { ModuleCondensed } from "../../types/modules";
import { getAllExistingValues } from "../classes/unique-check";
import axios from "axios";

const nusmodsApi = (req: string) =>
  `https://api.nusmods.com/v2/2021-2022/${req}.json`;

export const pullModuleList = https.onRequest(async (req, res) => {
  const moduleList = firestore().collection("moduleList");

  const already = await getAllExistingValues('moduleList', 'moduleCode')
  
  /* get existing modules */


  const apiRequest = nusmodsApi(`moduleList`);
  const result = await axios.get(apiRequest);
  const data: ModuleCondensed[] = result.data;

  const filtered = data.filter(x => !already.exists(x.moduleCode))

  const stack: Promise<DocumentReference<DocumentData>>[] = [];

  filtered.forEach((x: ModuleCondensed) => {
    stack.push(moduleList.add(x));
  });

  console.log(filtered)
  console.log('added')

  await Promise.allSettled(stack);
  res.json({
    result: data,
  });
});
