import {firestore} from 'firebase-admin';
import {Module} from '../../types/nusmods';

/**
 * Add moduleNumber parameter to each module in "modules" collection
 */
export const addModuleNumber = async (): Promise<string> => {
  // get all data
  const collectionRef = firestore().collection('modules');
  const snapshot = await collectionRef.get();

  await Promise.all(
      snapshot.docs.map(async (doc) => {
        const id = doc.id;
        const data = doc.data();
        const module: Module = {
          acadYear: data.acadYear || '',
          moduleCode: data.moduleCode,
          title: data.title || '',
          description: data.description || '',
          moduleCredit: data.moduleCredit || '0',
          department: data.department || '',
          faculty: data.faculty || '',
          workload: data.workload || '',
          aliases: data.aliases || [],
          attributes: data.attributes || {},
          prerequisite: data.prerequisite || '',
          corequisite: data.corequisite || '',
          preclusion: data.preclusion || '',
          semesterData: data.semesterData || [],
          prereqTree: data.prereqTree || '',
          fulfillRequirements: data.fulfillRequirements || [],
        };
        return await collectionRef.doc(id).update({moduleNumber: module.moduleCode.replace(/[^0-9]/g, '')});
      })
  );

  return 'done';
};
