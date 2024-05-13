import {
    expect,
} from '@loopback/testlab';
import {HiltonQuizApplication} from '../../../application';
import {Guest} from '../../../models';
import {GuestService} from '../../../services';
import {setupApplication} from '../test-helper';

describe('guest.service (integration)', () => {
    let app: HiltonQuizApplication;
    let guestService: GuestService

    beforeEach('setupApplication', async () => {
        ({app} = await setupApplication());
        guestService = await app.get('services.GuestService')
    });

    afterEach(async () => {
        await app.stop();
    });

    it('guest register', async () => {
        const data: Pick<Guest, 'email' | 'password'> = {
            email: 'mail@guest.com',
            password: 'password'
        }

        const guest = await guestService.register(data)
        expect(guest.id).to.not.null()
        expect(guest.email).to.equal(data.email)
        expect(guest.password).not.equal(data.password)
    });
});
