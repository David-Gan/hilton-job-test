import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {JwtPayload} from 'jsonwebtoken';
import {JwtService} from '../services';
import {EmployeeService} from '../services/employee.service';

export interface Credentials {
  email: string;
  password: string;
}

export class EmployeeAuthenticationStrategy implements AuthenticationStrategy {
  name: string = 'employee';

  constructor(
    @service(EmployeeService)
    private employeeService: EmployeeService,
    @service(JwtService)
    private jwtService: JwtService
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = this.extractCredentials(request);
    try {
      const payload: JwtPayload = this.jwtService.verify(token);
      const guset = await this.employeeService.employeeModel.findById(payload.id, {select: 'id, email, createdAt'})
      return guset as unknown as UserProfile
    } catch (e) {
      throw new HttpErrors.Unauthorized(`Invalid Token.`);
    }
  }

  extractCredentials(request: Request): string {
    if (!request.headers.employee_token) {
      throw new HttpErrors.Unauthorized(`Employee token header not found.`);
    }

    return request.headers.employee_token as string;
  }
}
