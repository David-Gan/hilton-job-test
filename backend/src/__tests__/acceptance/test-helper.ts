import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';

import {HiltonQuizApplication} from '../..';
import {clearDb} from '../common';



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

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: HiltonQuizApplication;
  client: Client;
}
