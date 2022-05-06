import { https } from "firebase-functions";
// import { firestore } from "firebase-admin";
import { utils } from ".";

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

//  {
//    "and": [
//      {
//        "or": [
//          "CS2010",
//          "CS2020",
//          {
//            "or": [
//              "CS2030",
//              "CS2113",
//              "CS2113T"
//            ]
//          }
//        ]
//      },
//      "CS2040"
//    ]
//  }

// Directed Acyclic Graph
class Dag {
  nodes: GraphNode[];
  constructor(prereqTree: PrereqTree) {
    console.log(prereqTree);
    this.nodes = [new GraphNode("CS1010S", [])];
  }
}

export const initDag = https.onRequest(async (req, res) => {
  const modInfo = await utils.getMod({ moduleCode: "CS2309" })
  const tree = modInfo.prereqTree
  const dag = new Dag(tree);
  console.log(dag)
  res.json({
    message: "yes",
  });
});
