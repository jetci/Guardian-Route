export enum Role {
  FIELD_OFFICER = 'FIELD_OFFICER',
  SUPERVISOR = 'SUPERVISOR',
  EXECUTIVE = 'EXECUTIVE',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
