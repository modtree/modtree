import {PrereqTree} from "../../types/modules";
import utils from "../utils";

export class Module {
  moduleCode: string;
  constructor(moduleCode: string) {
    this.moduleCode = moduleCode;
  }
  async getPrereqTree(): Promise<PrereqTree> {
    return utils.getMod({moduleCode: this.moduleCode}).then((module) => {
      return module.prereqTree || "";
    });
  }
}
