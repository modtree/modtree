import {checkTree} from "../utils";
import { Degree, Module } from ".";

export class User {
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
