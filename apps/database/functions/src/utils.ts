import {PrereqTree, Module} from "../types/modules";
import {firestore} from "firebase-admin";
import {DocumentData} from "@google-cloud/firestore";

export function checkTree(
    prereqTree: PrereqTree,
    modulesCleared: string[]
): boolean {
  console.log("checkTree", prereqTree);
  if (prereqTree === "") return true;
  else if (typeof prereqTree === "string") {
    return modulesCleared.includes(prereqTree);
  } else if (Array.isArray(prereqTree.and)) {
    return prereqTree.and.every((one: PrereqTree) =>
      checkTree(one, modulesCleared)
    );
  } else if (Array.isArray(prereqTree.or)) {
    return prereqTree.or.some((one: PrereqTree) =>
      checkTree(one, modulesCleared)
    );
  } else {
    console.warn("not supposed to be here");
    return true;
  }
}

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
    acadYear: data.acadYear || "",
    moduleCode: data.moduleCode || "",
    title: data.title || "",
    description: data.description || "",
    moduleCredit: data.moduleCredit || "0",
    department: data.department || "",
    faculty: data.faculty || "",
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

export default {checkTree, getMod};
