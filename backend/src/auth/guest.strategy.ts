import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {JwtPayload} from 'jsonwebtoken';
import {GuestService, JwtService} from '../services';

export interface Credentials {
  email: string;
  password: string;
}

export class GuestAuthenticationStrategy implements AuthenticationStrategy {
  name: string = 'guest';

  constructor(
    @service(GuestService)
    private guestService: GuestService,
    @service(JwtService)
    private jwtService: JwtService
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = this.extractCredentials(request);
    try {
      const payload: JwtPayload = this.jwtService.verify(token);
      const guset = await this.guestService.guestModel.findById(payload.id, {select: 'id, email, createdAt'})
      return guset as unknown as UserProfile
    } catch (e) {
      throw new HttpErrors.Unauthorized(`Invalid Token.`);
    }
  }

  extractCredentials(request: Request): string {
    if (!request.headers.guest_token) {
      throw new HttpErrors.Unauthorized(`Guest token header not found.`);
    }

    return request.headers.guest_token as string;
  }
}
