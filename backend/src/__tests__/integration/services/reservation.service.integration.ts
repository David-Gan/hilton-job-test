import {
    expect,
} from '@loopback/testlab';
import {HiltonQuizApplication} from '../../../application';
import {ReservationStatus} from '../../../models';
import {GuestService, ReservationService} from '../../../services';
import {createGuest, createReservation} from '../../common';
import {setupApplication} from '../test-helper';

describe('reservation.service (integration)', () => {
    let app: HiltonQuizApplication;
    let guestService: GuestService;
    let reservationService: ReservationService;

    beforeEach('setupApplication', async () => {
        ({app} = await setupApplication());
        guestService = await app.get('services.GuestService')
        reservationService = await app.get('services.ReservationService')
    });

    afterEach(async () => {
        await app.stop();
    });

    it('create reservation', async () => {
        const guest = await createGuest(guestService)

        const reservation = await reservationService.create({
            name: 'name',
            phone: '18888888888',
            size: 1,
            arrivalAt: new Date(),
            guest
        })

        expect(reservation.id).to.not.null()
        expect(reservation.status).to.equal(ReservationStatus.Pending)
        expect(reservation.guest).to.equal(guest.id)
    });

    it('update reservation', async () => {
        const guest = await createGuest(guestService)
        const reservation = await createReservation(reservationService, guest)

        const updatedReservation = await reservationService.update(reservation.id, {
            name: 'name2',
            phone: '18888888888',
            size: 2,
            arrivalAt: new Date(),
        })

        expect(updatedReservation.id).to.equal(reservation.id)
        expect(updatedReservation.name).to.equal('name2')
        expect(updatedReservation.size).to.equal(2)
    });

    it('cancel reservation', async () => {
        const guest = await createGuest(guestService)
        const reservation = await createReservation(reservationService, guest)
        const updatedReservation = await reservationService.cancel(reservation.id)

        expect(updatedReservation.id).to.equal(reservation.id)
        expect(updatedReservation.status).to.equal(ReservationStatus.Cancelled)
    });

    it('complete reservation', async () => {
        const guest = await createGuest(guestService)
        const reservation = await createReservation(reservationService, guest)
        const updatedReservation = await reservationService.complete(reservation.id)

        expect(updatedReservation.id).to.equal(reservation.id)
        expect(updatedReservation.status).to.equal(ReservationStatus.Completed)
    });
});
