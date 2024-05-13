import {field, ID, Int, objectType} from '@loopback/graphql';

@objectType({description: 'Reservation'})
export class Reservation {
  @field(type => ID)
  id: string;

  @field(type => String, {
    description: 'Guest Name',
  })
  name: String;

  @field(type => String, {
    description: 'Guest Contact',
  })
  contact: String;

  @field(type => Date, {
    description: 'Expected arrival time',
  })
  arrivalAt: Date;

  @field(type => Int, {
    description: 'Reserved table size info',
  })
  size: number;

  @field(type => String, {
    description: 'Status of the reservation',
  })
  status: string;
}
