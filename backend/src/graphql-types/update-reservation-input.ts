import {field, ID, inputType, Int} from '@loopback/graphql';
import {Reservation} from './reservation-type';

@inputType()
export class UpdateReservationInput implements Partial<Pick<Reservation, 'name' | 'contact' | 'arrivalAt' | 'size'>> {
  @field(type => ID)
  id: string;

  @field(type => String, {
    description: 'Guest Name',
    nullable: true
  })
  name?: string;

  @field(type => String, {
    description: 'Guest contact Info',
    nullable: true
  })
  contact?: string;

  @field(type => Date, {
    description: 'Expected arrival time',
    nullable: true
  })
  arrivalAt?: Date;

  @field(type => Int, {
    description: 'Reserved table size info',
    nullable: true
  })
  size?: number;
}
