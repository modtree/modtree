import { https } from "firebase-functions";
import axios from "axios";
import { firestore } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { DocumentData } from "@google-cloud/firestore";
import { Module } from "../types/modules";

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
  const collectionRef = firestore().collection("modules");
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
  console.log(data)
  res.json({
    result: data,
  });
});

export const numberMods = https.onRequest(async (req, res) => {
  const collectionRef = firestore().collection("modules");
  const length = await collectionRef.listDocuments();
  res.json({
    length: length.length,
  });
});

export namespace utils {
  export const getMod = async (
    search: Record<string, string>
  ): Promise<Module> => {
    const collectionRef = firestore().collection("modules");
    const arr = Object.entries(search);
    let query = collectionRef.where(arr[0][0], "==", arr[0][1]);
    for (let i = 1; i < arr.length; i++) {
      query = query.where(arr[i][0], "==", arr[i][1]);
    }
    const snapshot = await query.get();
    const result: DocumentData[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      result.push(data);
    });
    if (result.length === 0) {
      return {
        acadYear: "",
        moduleCode: "",
        title: "",
        description: "",
        moduleCredit: "",
        department: "",
        faculty: "",
        workload: "",
        aliases: [],
        attributes: {},
        prerequisite: "",
        corequisite: "",
        preclusion: "",
        semesterData: [],
        prereqTree: "",
        fulfillRequirements: [],
      };
    }
    const data = result[0];
    const module: Module = {
      acadYear: data.acadYear,
      moduleCode: data.moduleCode,
      title: data.title,
      description: data.description || "",
      moduleCredit: data.moduleCredit,
      department: data.department,
      faculty: data.faculty,
      workload: data.workload || "",
      aliases: data.aliases || [],
      attributes: data.attributes || {},
      prerequisite: data.prerequisite || "",
      corequisite: data.corequisite || "",
      preclusion: data.preclusion || "",
      semesterData: data.semesterData || [],
      prereqTree: data.prereqTree || "",
      fulfillRequirements: data.fulfillRequirements || [],
    };
    return module;
  };
}

export const getMod = https.onRequest(async (req, res) => {
  const search: Record<string, string> = req.body;
  const collectionRef = firestore().collection("modules");
  // const q = firestore().collection('modules').where('acadYear', "==", '2021/2022').where().where()
  const arr = Object.entries(search);
  let query = collectionRef.where(arr[0][0], "==", arr[0][1]);
  for (let i = 1; i < arr.length; i++) {
    query = query.where(arr[i][0], "==", arr[i][1]);
  }
  const snapshot = await query.get();
  const result: DocumentData[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    console.log('get mod', data)
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

export * from "./degree";
export * from "./dag";
