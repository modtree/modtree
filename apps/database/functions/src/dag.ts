import { https } from "firebase-functions";
// import { firestore } from "firebase-admin";
import { utils } from ".";
import { Degree } from "./degree";
import { Module } from "../types/modules";

type PrereqTree = string | { and?: PrereqTree[]; or?: PrereqTree[] };

// class Edge {
//   pre: string;
//   post: string;
//   constructor(pre: string, post: string) {
//     this.pre = pre;
//     this.post = post;
//   }
// }

class GraphNode {
  name: string;
  required: GraphNode[];
  constructor(name: string, required: GraphNode[]) {
    this.name = name;
    this.required = required.length === 0 ? [] : required;
  }
}

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

export const test = https.onRequest(async (req, res) => {
  const user = new User();
  const degree = new Degree("Computer Science", ["CS1010S", "CS1231S"]);
  user.setDegree(degree);
  const hardRequirements = user.degree.getHardRequirements()
  hardRequirements.forEach(module => {
    // get module into from database
    // if no prereqTree, return true
    // else traverse the tree
  })
  console.log(user, hardRequirements)
  res.json({
    message: "done"
  })
  return
});
