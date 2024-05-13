export type Reservation = {
    id: string
    name: string,
    contact: string,
    size: number,
    arrivalAt: Date,
    status: string
}


export enum ReservationStatus {
    Pending = 'Pending',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
  }
  