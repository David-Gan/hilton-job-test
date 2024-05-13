import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {Reservation, ReservationModel, ReservationStatus} from '../models';


@injectable({scope: BindingScope.SINGLETON})
export class ReservationService {
  constructor(
    @inject('models.reservation')
    public reservationModel: ReservationModel
  ) { }

  public async create(data: Pick<Reservation, 'name' | 'phone' | 'size' | 'arrivalAt' | 'guest'>): Promise<ReservationModel> {
    const reservation = this.reservationModel.fromData(data)
    reservation.status = ReservationStatus.Pending
    await reservation.save()
    return reservation;
  }

  public async update(id: string, data: Pick<Reservation, 'name' | 'phone' | 'size' | 'arrivalAt'>): Promise<Reservation> {
    const reservation = await this.reservationModel.updateById(id, data)
    return reservation;
  }

  public async cancel(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel.updateById(id, {status: ReservationStatus.Cancelled})
    return reservation;
  }

  public async complete(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel.updateById(id, {status: ReservationStatus.Completed})
    return reservation;
  }
}
