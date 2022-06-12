import { db } from '@modtree/typeorm-config';
import { getApp } from './server/app';

db.initialize().then(async () => {
  const app = getApp();
  app.listen(process.env.PORT || 8080);
});
