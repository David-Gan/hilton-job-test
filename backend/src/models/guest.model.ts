import {ModelTypes, Ottoman, Schema} from 'ottoman';
import {HiltonQuizApplication} from '../application';
import {JwtService} from '../services';

export type Guest = {
  id: string
  email: string
  password: string
  createdAt: Date
}

export type GuestModel = ModelTypes<Partial<Guest>, Guest>

export const GuestSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true}
}, {timestamps: true});

GuestSchema.index.findByEmail = {
  by: 'email',
  type: 'refdoc',
  options: {
    enforceRefCheck: false
  }
};

export const initGuestModel = async (app: HiltonQuizApplication, ottoman: Ottoman) => {
  const jwtService: JwtService = await app.get('services.JwtService')

  GuestSchema.methods.token = function () {
    return jwtService.sign({id: this.id})
  };

  app.bind('models.guest').to(
    ottoman.model('Guest', GuestSchema)
  )
}
