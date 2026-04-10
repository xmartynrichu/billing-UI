/**
 * User Module Models
 */

export interface User {
  id: number;
  username: string;
  userid: string;
  password: string;
  dob: Date;
  mobile: string;
  email: string;
  entryby: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  username: string;
  userid: string;
  password: string;
  dob: Date;
  mobile: string;
  email: string;
  entryby: string;
}

export interface UpdateUserRequest extends CreateUserRequest {
  id: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: User;
}
