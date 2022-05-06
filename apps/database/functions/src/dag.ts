import { https } from "firebase-functions";
// import { firestore } from "firebase-admin";
import { utils } from ".";
import { Degree } from "./degree";
// import { Module } from "../types/modules";
// import { DocumentData } from "@google-cloud/firestore";

type PrereqTree = string | { and?: PrereqTree[]; or?: PrereqTree[] };

// class Edge {
//   pre: string;
//   post: string;
//   constructor(pre: string, post: string) {
//     this.pre = pre;
//     this.post = post;
//   }
// }

// class GraphNode {
//   name: string;
//   required: GraphNode[];
//   constructor(name: string, required: GraphNode[]) {
//     this.name = name;
//     this.required = required.length === 0 ? [] : required;
//   }
// }

class User {
  done: string[];
  degree: Degree;
  constructor() {
    this.done = [];
    this.degree = Degree.empty;
  }
  do(moduleCode: string) {
    if (!this.done.includes(moduleCode)) {
      this.done.push(moduleCode);
    }
  }
  setDegree(degree: Degree) {
    this.degree = degree;
  }
}

// class Tree {
//   tree: PrereqTree;
//   constructor(tree: PrereqTree) {
//     this.tree = tree;
//   }
// }
//

function checkTree(prereqTree: PrereqTree, modulesCleared: string[], hardRequirements: string[]): boolean {
  if (typeof prereqTree === 'string')
    return hardRequirements.includes(prereqTree);
  else if (Array.isArray(prereqTree.and)) {
    return prereqTree.and.every((one: PrereqTree) => checkTree(one, modulesCleared, hardRequirements))
  } else if (Array.isArray(prereqTree.or)) {
    return prereqTree.or.some((one: PrereqTree) => checkTree(one, modulesCleared, hardRequirements))
  } else {
    return false;
  }
}

export const test = https.onRequest(async (req, res) => {
  const user = new User();
  const degree = new Degree("Computer Science", [
    "CS1101S",
    "CS1231S",
    "CS2030S",
  ]);
  user.setDegree(degree);
  const hardRequirements = user.degree.getHardRequirements();
  const q: Promise<number | void>[] = [];
  const prereqTrees: PrereqTree[] = [];
  hardRequirements.forEach((module) => {
    q.push(
      utils.getMod({ moduleCode: module }).then((module) => {
        console.log("1st in queue", module.title);
        prereqTrees.push(module.prereqTree || "");
      })
    );
  });
  await Promise.allSettled(q);

  console.log("trees", prereqTrees);
  hardRequirements.forEach((module) => {
    console.log("2nd", module);
    // get module into from database
    // if no prereqTree, return true
    // else traverse the tree
    return checkTree(prereqTree, user.done, hardRequirements);
  })
  console.log(user, hardRequirements)
  res.json({
    message: "done",
  });
  return;
});
