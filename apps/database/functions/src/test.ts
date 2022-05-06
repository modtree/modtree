import {https} from 'firebase-functions';
import {User, Degree} from './classes';

export const test = https.onRequest(async (req, res) => {
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

  res.json({
    message: 'done',
  });
  return;
});
