import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {
  Request,
  Response,
  ResponseObject,
  RestBindings,
  SchemaObject,
  get,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {SecurityBindings} from '@loopback/security';
import {JTDDataType} from "ajv/dist/jtd";
import {Employee, EmployeeModel} from '../models/employee.model';
import {EmployeeService} from '../services/employee.service';

const LOGIN_RESPONSE: ResponseObject = {
  description: 'Login Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'Employee Login Response',
        properties: {
          token: {type: 'string'},
        },
      },
    },
  },
};

export const REGISTER_REQUEST = {
  type: 'object',
  properties: {
    email: {type: 'string', pattern: "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"},
    password: {type: 'string', minLength: 6, maxLength: 100}
  },
  required: ['email', 'password']
} as const

export const LOGIN_REQUEST = REGISTER_REQUEST

const EMPLOYEE_INFO_RESPONSE = {
  description: 'Employee Info Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'Employee Info Response',
        properties: {
          id: {type: 'string'},
          email: {type: 'string', format: "email"},
          createdAt: {type: 'string'},
        },
      },
    },
  },
}

/**
 * A simple controller to bounce back http requests
 */
export class EmployeeController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @service(EmployeeService) private employeeService: EmployeeService,
  ) { }

  @post('/employee/login')
  @response(200, LOGIN_RESPONSE)
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: LOGIN_REQUEST as unknown as SchemaObject
        },
      },
    })
    data: JTDDataType<typeof LOGIN_REQUEST>,
    @inject(RestBindings.Http.RESPONSE) res: Response
  ): Promise<{token: string} | void> {
    const errorMsg = 'Email or Pawword is wrong.'
    const employee = await this.employeeService.findByEmail(data.email)
    if (!employee) {
      res.status(400).send({email: errorMsg});
      return
    }

    if (!this.employeeService.verifyPassword(employee, data.password)) {
      res.status(400).send({email: errorMsg});
      return
    }

    return {
      token: employee.token()
    };
  }

  @authenticate('employee')
  @get('/employee/info')
  @response(200, EMPLOYEE_INFO_RESPONSE)
  async info(
    @inject(SecurityBindings.USER) employee: EmployeeModel
  ): Promise<Omit<Employee, 'password'>> {
    return employee.toJSON();
  }
}
