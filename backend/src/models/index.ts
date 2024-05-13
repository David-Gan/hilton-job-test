import {Ottoman} from 'ottoman';
import {HiltonQuizApplication} from '../application';
import {initGuestModel} from './guest.model';

export * from './guest.model';

export const bootModels = async (app: HiltonQuizApplication) => {
  const ottoman = new Ottoman()

  await ottoman.connect({
    connectionString: 'couchbase://127.0.0.1',
    bucketName: 'default',
    username: 'Administrator',
    password: 'password'
  });

  await initGuestModel(app, ottoman);

  await ottoman.start();

  app.bind('ottoman').to(ottoman)

  app.onStop(async () => {
    await ottoman.close();
  })
};
