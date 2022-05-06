import { https } from "firebase-functions";
// import { firestore } from "firebase-admin";
import { utils } from ".";
import { Degree } from "./degree";
import { Module as NusmodsModule } from "../types/modules";
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

class Module {
  moduleCode: string;
  constructor(moduleCode: string) {
    this.moduleCode = moduleCode;
  }
  async getPrereqTree(): Promise<PrereqTree> {
    return utils.getMod({ moduleCode: this.moduleCode }).then((module) => {
      return module.prereqTree || "";
    });
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
  // can take it right now, given modules done
  async canTakeModule(moduleCode: string): Promise<boolean> {
    const module = new Module(moduleCode);
    const prereqTree = await module.getPrereqTree();
    const can = checkTree(prereqTree, this.done);
    return can;
  }
}

// class Tree {
//   tree: PrereqTree;
//   constructor(tree: PrereqTree) {
//     this.tree = tree;
//   }
// }
//

function checkTree(prereqTree: PrereqTree, modulesCleared: string[]): boolean {
  console.log("checkTree", prereqTree);
  if (prereqTree === "") return true;
  else if (typeof prereqTree === "string")
    return modulesCleared.includes(prereqTree);
  else if (Array.isArray(prereqTree.and)) {
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

export const test = https.onRequest(async (req, res) => {
  const user = new User();
  const degree = new Degree("Computer Science", [
    "CS1101S",
    "CS1231S",
    "CS2030S",
  ]);
  user.setDegree(degree);

  const moduleCode = 'MA2101'
  const t1 = await user.canTakeModule(moduleCode)
  console.log(moduleCode, t1)

  user.do('MA2001')

  const t2 = await user.canTakeModule(moduleCode)
  console.log(moduleCode, t2)


  res.json({
    message: "done",
  });
  return;
});
