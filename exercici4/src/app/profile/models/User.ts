import { UserType } from './UserType'

export class User {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  type: UserType;
  companyName?: string;
  companyDescription?: string;
  cif?: string;
  phone?: string;
  birthdate?: Date;
  nationality?: string;
  nif?: string;
  aboutMe?: string;
}
