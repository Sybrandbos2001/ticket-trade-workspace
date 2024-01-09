import { Role } from '../enum/role.enum';

export interface User {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthdate: Date;
  roles: Role;
}