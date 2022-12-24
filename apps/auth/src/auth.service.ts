import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '@app/shared/interfaces/users.repository.interface';
import { UserEntity } from '@app/shared/entities/user.entity';
import { AuthServiceInterface } from './interface/auth.service.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UserRepositoryInterface,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    return await this.usersRepository.findAll();
  }

  async postUser(): Promise<UserEntity> {
    const newUser = this.usersRepository.create({ lastName: 'Barry' });
    return await this.usersRepository.save(newUser);
  }
}
