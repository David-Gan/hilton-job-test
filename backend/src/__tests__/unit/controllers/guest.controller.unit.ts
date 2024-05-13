import {expect} from '@loopback/testlab';
import Ajv from 'ajv';
import {REGISTER_REQUEST} from '../../../controllers';

describe('GuestController', () => {

  it('check register schema', () => {
    const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
    const schema = REGISTER_REQUEST
    const validate = ajv.compile(schema)

    expect(validate({email: 'any@test.com', password: 'password'})).to.equal(true)
    expect(validate({email: 'anytest.com', password: 'password'})).to.equal(false)
    expect(validate({email: 'any@test.com', password: '12345'})).to.equal(false)
    expect(validate({email: '', password: 'password'})).to.equal(false)
    expect(validate({email: 'any@test.com', password: ''})).to.equal(false)
  });

});
