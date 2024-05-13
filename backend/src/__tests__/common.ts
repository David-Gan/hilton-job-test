import {Ottoman} from 'ottoman'
import {HiltonQuizApplication} from '../application'
import {GuestModel} from '../models'
import {GuestService, ReservationService} from '../services'
const {RangeScan} = require('couchbase/dist/rangeScan')

export const clearDb = async (app: HiltonQuizApplication) => {
  const ottoman: Ottoman = await app.get('ottoman')
  await clearCollection(ottoman, 'Guest')
  await clearCollection(ottoman, 'Employee')
  await clearCollection(ottoman, 'Reservation')
}

export const clearCollection = async (ottoman: Ottoman, collectionName: string) => {
  const collection = ottoman.cluster.bucket('default').scope('_default').collection(collectionName)
  const result = await collection.scan(new RangeScan())
  await Promise.all(
    result.map(item => collection.remove(item.id))
  )
}

export const createGuest = async (guestService: GuestService) => {
  const guest = await guestService.register({
    email: 'mail@guest.com',
    password: 'password'
  })
  return guest
}

export const createReservation = async (reservationService: ReservationService, guest: GuestModel) => {
  const reservation = await reservationService.create({
    name: 'name',
    contact: '18888888888',
    size: 1,
    arrivalAt: new Date(),
    guest
  })

  return reservation
}
