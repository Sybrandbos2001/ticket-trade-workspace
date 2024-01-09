import { Role } from '../enum/role.enum';

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthdate: Date;
  roles: Role;
}