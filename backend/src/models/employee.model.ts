import {ModelTypes, Ottoman, Schema} from 'ottoman';
import {HiltonQuizApplication} from '../application';
import {JwtService} from '../services';

export type Employee = {
  id: string
  email: string
  password: string
  createdAt: Date
}

export type EmployeeModel = ModelTypes<Partial<Employee>, Employee>

export const EmployeeSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true}
}, {timestamps: true});

EmployeeSchema.index.findByEmail = {
  by: 'email',
  type: 'refdoc'
};

export const initEmployeeModel = async (app: HiltonQuizApplication, ottoman: Ottoman) => {
  const jwtService: JwtService = await app.get('services.JwtService')

  EmployeeSchema.methods.token = function () {
    return jwtService.sign({id: this.id})
  };

  app.bind('models.employee').to(
    ottoman.model('Employee', EmployeeSchema)
  )
}
