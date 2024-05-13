import {EmployeeModel, GuestModel} from '../models';

export interface GraphqlContext {
  guest?: GuestModel
  employee?: EmployeeModel
}
