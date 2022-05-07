import {
  FirestoreDataConverter as Converter,
  DocumentData,
} from '@google-cloud/firestore';
import {Degree, Module} from '../classes';
import {Module as NusmodsModule} from '../../types/nusmods';

export namespace flatten {
  type Either<T> = T | DocumentData
  export const nusmodsModule = (src: Either<NusmodsModule>): NusmodsModule => ({
    acadYear: src.acadYear || '',
    moduleCode: src.moduleCode || '',
    title: src.title || '',
    description: src.description || '',
    moduleCredit: src.moduleCredit || '',
    department: src.department || '',
    faculty: src.faculty || '',
    workload: src.workload || '',
    aliases: src.aliases || [],
    attributes: src.attributes || {},
    prerequisite: src.prerequisite || '',
    corequisite: src.corequisite || '',
    preclusion: src.preclusion || '',
    semesterData: src.semesterData || [],
    prereqTree: src.prereqTree || '',
    fulfillRequirements: src.fulfillRequirements || [],
  });
}

export namespace converter {
  export const degree: Converter<Degree> = {
    toFirestore: (degree) => {
      return {
        name: degree.name,
        hardRequirements: degree.hardRequirements,
      };
    },
    fromFirestore: (snapshot) => {
      const data = snapshot.data();
      return new Degree(data.name, data.hardRequirements);
    },
  };
  export const module: Converter<Module> = {
    toFirestore: (module) => {
      return {
        moduleCode: module.moduleCode,
      };
    },
    fromFirestore: (snapshot) => {
      const data = snapshot.data();
      return new Module(data.moduleCode);
    },
  };
  export const nusmodsModule: Converter<NusmodsModule> = {
    toFirestore: (module) => {
      return flatten.nusmodsModule(module);
    },
    fromFirestore: (snapshot) => {
      const data = snapshot.data();
      return flatten.nusmodsModule(data);
    },
  };
}
