// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject, service} from '@loopback/core';
import {
  GraphQLBindings,
  ResolverData,
  arg,
  authorized,
  mutation,
  query,
  resolver
} from '@loopback/graphql';
import dayjs from 'dayjs';
import {CreateReservationInput} from '../graphql-types/create-reservation-input';
import {Reservation} from '../graphql-types/reservation-type';
import {UpdateReservationInput} from '../graphql-types/update-reservation-input';
import {ReservationModel} from '../models';
import {ReservationService} from '../services';
import {GraphqlContext} from './types';

@resolver(of => Reservation)
export class ReservationResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA) private resolverData: ResolverData,
    @service(ReservationService) private reservationService: ReservationService,
  ) { }

  @query(returns => [Reservation])
  @authorized('guest')
  async my_reservations(): Promise<Reservation[]> {
    const {guest} = this.resolverData.context as GraphqlContext
    const {rows} = await this.reservationService.reservationModel.findByGuest(guest!.id)
    return rows;
  }

  @query(returns => [Reservation])
  @authorized('employee')
  async reservations(
    @arg('status', {nullable: true}) status?: string,
    @arg('date', {nullable: true}) date?: string,
  ): Promise<Reservation[]> {
    const filter: {status?: string, arrivalAt?: {$gte: Date, $lte: Date}} = {}
    if (status) {
      filter.status = status
    }
    if (date) {
      const arrivalAt = dayjs(date)
      filter.arrivalAt = {
        $gte: arrivalAt.toDate(),
        $lte: arrivalAt.add(1, 'day').toDate(),
      }
    }

    const {rows} = await this.reservationService.reservationModel.find(filter)
    return rows;
  }

  @authorized('guest')
  @mutation(returns => Reservation)
  async createReservation(
    @arg('input') input: CreateReservationInput,
  ): Promise<ReservationModel> {
    const {guest} = this.resolverData.context as GraphqlContext
    const reservation = await this.reservationService.create({...input, guest: guest!})
    return reservation;
  }

  @authorized('guest', 'employee')
  @mutation(returns => Reservation)
  async updateReservation(
    @arg('input') input: UpdateReservationInput,
  ): Promise<Reservation> {
    const {id, ...data} = input
    const updatedReservation = await this.reservationService.update(id, data);
    return updatedReservation
  }

  @authorized('employee')
  @mutation(returns => Reservation)
  async cancelReservation(
    @arg('id') id: string,
  ): Promise<Reservation> {
    const updatedReservation = await this.reservationService.cancel(id);
    return updatedReservation
  }

  @authorized('employee')
  @mutation(returns => Reservation)
  async completeReservation(
    @arg('id') id: string,
  ): Promise<Reservation> {
    const updatedReservation = await this.reservationService.complete(id);
    return updatedReservation
  }
}
