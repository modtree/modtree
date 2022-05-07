import {https} from 'firebase-functions';
import {User, Degree} from './classes';

import {utils} from './utils';
import {Module} from '../types/nusmods';
import {addModuleNumber} from './migrations/addModuleNumber';

export const test = https.onRequest(async (req, res) => {
  // canTakeModule tests
  const user = new User();
  const degree = new Degree('Computer Science', [
    'CS1101S',
    'CS1231S',
    'CS2030S',
  ]);
  user.setDegree(degree);

  const moduleCode = 'MA2101';
  const t1 = await user.canTakeModule(moduleCode);
  console.log(moduleCode, t1);

  user.do('MA2001');

  const t2 = await user.canTakeModule(moduleCode);
  console.log(moduleCode, t2);

  // addModuleNumber tests
  await addModuleNumber();

  const record: Record<string, string> = {};
  record['moduleNumber'] = '1010';
  const test: Module = await utils.getMod(record);

  console.log(test);

  res.json({
    message: 'done',
  });
  return;
});
