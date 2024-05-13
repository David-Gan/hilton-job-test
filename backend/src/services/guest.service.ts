import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import bcrypt from "bcrypt";
import {Guest, GuestModel} from '../models';


@injectable({scope: BindingScope.SINGLETON})
export class GuestService {
  private salt: string = bcrypt.genSaltSync(10);

  constructor(
    @inject('models.guest')
    public guestModel: GuestModel
  ) { }

  hashPassword(password: string) {
    return bcrypt.hashSync(password, this.salt);
  }

  verifyPassword(guest: GuestModel, password: string) {
    const hash = this.hashPassword(password)
    return guest.password === hash
  }

  async register(data: Pick<Guest, 'email' | 'password'>) {
    const guest = this.guestModel.fromData(data)
    guest.password = this.hashPassword(guest.password)

    await guest.save()
    return guest
  }

  async findByEmail(email: string) {
    try {
      const guest = await this.guestModel.findByEmail(email)
      return guest
    } catch (e) {
      return null
    }
  }
}
