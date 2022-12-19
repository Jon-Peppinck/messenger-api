import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUsers() {
    return this.userRepository.find();
  }

  async postUser() {
    return this.userRepository.save({ lastName: 'Barry' });
  }
}
