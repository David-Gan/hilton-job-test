import {ModelTypes, Ottoman, Schema} from 'ottoman';
import {HiltonQuizApplication} from '../application';
import {GuestModel, GuestSchema} from './guest.model';

export enum ReservationStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export type Reservation = {
  id: string
  name: string
  contact: string
  size: number
  arrivalAt: Date
  status: ReservationStatus
  createdAt: Date
  updatedAt: Date
  guest: GuestModel
}

export type ReservationModel = ModelTypes<Partial<Reservation>, Reservation>

export const ReservationSchema = new Schema({
  guest: {type: GuestSchema, ref: 'Guest', required: true},
  name: {type: String, required: true},
  contact: {type: String, required: true},
  size: {type: Number, min: 1, required: true},
  arrivalAt: {type: Date, default: Date.now, required: true},
  status: {type: String, enum: Object.values(ReservationStatus), required: true}
}, {timestamps: true});

ReservationSchema.index.findByGuest = {
  by: ['guest'],
  type: 'n1ql',
  options: {
    sort: {
      id: 'DESC'
    }
  }
};

export const initReservationModel = async (app: HiltonQuizApplication, ottoman: Ottoman) => {
  app.bind('models.reservation').to(
    ottoman.model('Reservation', ReservationSchema)
  )
}
