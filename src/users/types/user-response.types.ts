import { User } from '../entity/user.entity';

export interface ApiResponse<T> {
  msg: string;
  type: 'success' | 'error';
  code: number;
  data: T;
}

export interface UserListResponse {
  msg: string;
  type: string;
  code: number;
  data: User[];
}

export type UserResponse = ApiResponse<User>;

export type UserMutationResponse = ApiResponse<User>;

export interface UserDeleteData {
  id: number;
  email: string;
}

export type UserDeleteResponse = ApiResponse<UserDeleteData>;
