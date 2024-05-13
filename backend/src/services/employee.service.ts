import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import bcrypt from "bcrypt";
import {Employee, EmployeeModel} from '../models/employee.model';

@injectable({scope: BindingScope.SINGLETON})
export class EmployeeService {
  private salt: string = bcrypt.genSaltSync(10);

  constructor(
    @inject('models.employee')
    public employeeModel: EmployeeModel
  ) { }

  hashPassword(password: string) {
    return bcrypt.hashSync(password, this.salt);
  }

  verifyPassword(employee: EmployeeModel, password: string) {
    const hash = this.hashPassword(password)
    return employee.password === hash
  }

  async register(data: Pick<Employee, 'email' | 'password'>) {
    const employee = this.employeeModel.fromData(data)
    employee.password = this.hashPassword(employee.password)

    await employee.save()
    return employee
  }

  async findByEmail(email: string) {
    try {
      const employee = await this.employeeModel.findByEmail(email)
      return employee
    } catch (e) {
      return null
    }
  }
}
