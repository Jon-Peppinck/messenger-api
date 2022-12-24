import { UserEntity } from '@app/shared/entities/user.entity';

export interface AuthServiceInterface {
  getUsers(): Promise<UserEntity[]>;
  postUser(): Promise<UserEntity>;
}
