import {
  givenHttpServerConfig
} from '@loopback/testlab';
import {Ottoman} from 'ottoman';
import {HiltonQuizApplication} from '../..';
import {clearCollection, clearDb} from '../common';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new HiltonQuizApplication({
    rest: restConfig,
  });

  await app.boot();
  await app.start();
  await clearDb(app);

  const ottoman: Ottoman = await app.get('ottoman')
  await clearCollection(ottoman, 'Guest')

  return {app};
}

export interface AppWithClient {
  app: HiltonQuizApplication;
}
