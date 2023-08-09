/**
 * user interface
 */

export interface UserPayload {
  name: string;
  email: string;
  password: string;
}

export interface FetchUsers {
  data: UserPayload;
  page: number;
  perPage: number;
}

export interface UpdatePayload {
  name: string;
  password: string;
}
