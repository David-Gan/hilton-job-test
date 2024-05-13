import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: string
}

@injectable({scope: BindingScope.SINGLETON})
export class JwtService {
  private secret: string = 'hilton-jwt-secret'
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */
  sign(payload: JwtPayload) {
    return jwt.sign(payload, this.secret)
  }

  verify(token: string) {
    return jwt.verify(token, this.secret) as JwtPayload
  }
}
