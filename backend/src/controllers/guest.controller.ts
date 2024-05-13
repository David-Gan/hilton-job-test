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
import {Guest, GuestModel} from '../models';
import {GuestService} from '../services';

const REGISTER_RESPONSE: ResponseObject = {
  description: 'Register Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'Guest Register Response',
        properties: {
          token: {type: 'string'},
        },
      },
    },
  },
};

const LOGIN_RESPONSE: ResponseObject = {
  description: 'Login Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'Guest Login Response',
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

const GUEST_INFO_RESPONSE = {
  description: 'Guest Info Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'Guest Info Response',
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
export class GuestController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @service(GuestService) private guestService: GuestService,
  ) { }

  @post('/guest/register')
  @response(200, REGISTER_RESPONSE)
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: REGISTER_REQUEST as unknown as SchemaObject
        },
      },
    })
    data: JTDDataType<typeof REGISTER_REQUEST>,
    @inject(RestBindings.Http.RESPONSE) res: Response
  ): Promise<{token: string} | void> {
    const isEmailExisted = await this.guestService.findByEmail(data.email)
    if (isEmailExisted) {
      res.status(400).send({email: 'Email already existed.'});
      return
    }

    const guest = await this.guestService.register(data);
    return {
      token: guest.token()
    };
  }

  @post('/guest/login')
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
    const guest = await this.guestService.findByEmail(data.email)
    if (!guest) {
      res.status(400).send({email: errorMsg});
      return
    }

    if (!this.guestService.verifyPassword(guest, data.password)) {
      res.status(400).send({email: errorMsg});
      return
    }

    return {
      token: guest.token()
    };
  }

  @authenticate('guest')
  @get('/guest/info')
  @response(200, GUEST_INFO_RESPONSE)
  async info(
    @inject(SecurityBindings.USER) guest: GuestModel
  ): Promise<Omit<Guest, 'password'>> {
    return guest.toJSON();
  }
}
