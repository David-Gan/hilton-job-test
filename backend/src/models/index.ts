import {Ottoman} from 'ottoman';
import {HiltonQuizApplication} from '../application';
import {initEmployeeModel} from './employee.model';
import {initGuestModel} from './guest.model';
import {initReservationModel} from './reservation.model';

export * from './employee.model';
export * from './guest.model';
export * from './reservation.model';

export const bootModels = async (app: HiltonQuizApplication) => {
  const ottoman = new Ottoman()

  await ottoman.connect({
    connectionString: process.env.DB_URI || '',
    bucketName: process.env.DB_BUCKET_NAME || '',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  await initGuestModel(app, ottoman);
  await initEmployeeModel(app, ottoman);
  await initReservationModel(app, ottoman);
  await ottoman.start();

  app.bind('ottoman').to(ottoman)

  app.onStop(async () => {
    await ottoman.close();
  })
};
