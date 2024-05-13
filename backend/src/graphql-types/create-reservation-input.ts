import {field, inputType, Int} from '@loopback/graphql';
import {Reservation} from './reservation-type';

@inputType()
export class CreateReservationInput implements Pick<Reservation, 'name' | 'contact' | 'arrivalAt' | 'size'> {
  @field(type => String, {
    description: 'Guest Name',
  })
  name: string;

  @field(type => String, {
    description: 'Guest contact Info',
  })
  contact: string;

  @field(type => Date, {
    description: 'Expected arrival time',
  })
  arrivalAt: Date;

  @field(type => Int, {
    description: 'Reserved table size info',
  })
  size: number;
}
