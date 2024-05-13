import {Client, expect} from '@loopback/testlab';
import {HiltonQuizApplication} from '../..';
import {GuestService} from '../../services';
import {setupApplication} from './test-helper';

describe('GuestController', () => {
  let app: HiltonQuizApplication;
  let client: Client;
  let guestService: GuestService

  beforeEach('setupApplication', async () => {
    ({app, client} = await setupApplication());
    guestService = await app.get('services.GuestService')
  });

  afterEach(async () => {
    await app.stop();
  });

  it('invokes POST /guest/register', async () => {
    const data = {email: 'test@guest.com', password: 'password'}
    const res = await client.post('/guest/register').send(data).expect(200)
    expect(res.body).to.have.property('token')
  });

  it('invokes POST /guest/register with repeated email', async () => {
    const email = 'test@guest.com'
    const password = '<PASSWORD>'
    await guestService.register({email, password})
    const res = await client.post('/guest/register').send({email, password}).expect(400)
    expect(res.body).to.have.property('email')
  });

  it('invokes GET /guest/info', async () => {
    const guest = guestService.guestModel.fromData({email: 'any@test.com', password: 'password'})
    await guest.save()
    const token = guest.token()
    const res = await client.get('/guest/info').set('guest_token', token).expect(200)
    expect(res.body).to.containEql({email: guest.email})
    expect(res.body).not.have.property('password')
  });

  it('invokes POST /guest/login', async () => {
    const email = 'test@guest.com'
    const password = '<PASSWORD>'
    await guestService.register({email, password})
    const res = await client.post('/guest/login').send({email, password})
    expect(res.body).to.have.property('token')
  });

  it('invokes POST /guest/login with invalid email', async () => {
    const email = 'test@guest.com'
    const password = '<PASSWORD>'
    await guestService.register({email, password})
    const res = await client.post('/guest/login').send({email: 'invalid@test.com', password}).expect(400)
    expect(res.body).to.containEql({'email': 'Email or Pawword is wrong.'})
  });

  it('invokes POST /guest/login with invalid password', async () => {
    const email = 'test@guest.com'
    const password = '<PASSWORD>'
    await guestService.register({email, password})
    const res = await client.post('/guest/login').send({email, password: 'invalid password'}).expect(400)
    expect(res.body).to.containEql({'email': 'Email or Pawword is wrong.'})
  });
});
