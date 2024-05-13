import {Client, expect} from '@loopback/testlab';
import {HiltonQuizApplication} from '../..';
import {EmployeeService} from '../../services/employee.service';
import {setupApplication} from './test-helper';

describe('EmployeeController', () => {
  let app: HiltonQuizApplication;
  let client: Client;
  let employeeService: EmployeeService

  beforeEach('setupApplication', async () => {
    ({app, client} = await setupApplication());
    employeeService = await app.get('services.EmployeeService')
  });

  afterEach(async () => {
    await app.stop();
  });

  it('invokes GET /employee/info', async () => {
    const employee = employeeService.employeeModel.fromData({email: 'any@test.com', password: 'password'})
    await employee.save()
    const token = employee.token()
    const res = await client.get('/employee/info').set('employee_token', token).expect(200)
    expect(res.body).to.containEql({email: employee.email})
    expect(res.body).not.have.property('password')
  });

  it('invokes POST /employee/login', async () => {
    const email = 'test@employee.com'
    const password = '<PASSWORD>'
    await employeeService.register({email, password})
    const res = await client.post('/employee/login').send({email, password})
    expect(res.body).to.have.property('token')
  });

  it('invokes POST /employee/login with invalid email', async () => {
    const email = 'test@employee.com'
    const password = '<PASSWORD>'
    await employeeService.register({email, password})
    const res = await client.post('/employee/login').send({email: 'invalid@test.com', password}).expect(400)
    expect(res.body).to.containEql({'email': 'Email or Pawword is wrong.'})
  });

  it('invokes POST /employee/login with invalid password', async () => {
    const email = 'test@employee.com'
    const password = '<PASSWORD>'
    await employeeService.register({email, password})
    const res = await client.post('/employee/login').send({email, password: 'invalid password'}).expect(400)
    expect(res.body).to.containEql({'email': 'Email or Pawword is wrong.'})
  });
});
