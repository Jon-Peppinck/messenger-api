import {
  ConflictException,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UserEntity, UserRepositoryInterface } from '@app/shared';

import { ExistingUserDTO } from './dtos/existing-user.dto';
import { NewUserDTO } from './dtos/new-user.dto';

import { AuthServiceInterface } from './interface/auth.service.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    return await this.usersRepository.findAll();
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findByCondition({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password'],
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(newUser: Readonly<NewUserDTO>): Promise<UserEntity> {
    const { firstName, lastName, email, password } = newUser;

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('An account with that email already exists!');
    }

    const hashedPassword = await this.hashPassword(password);

    const savedUser = await this.usersRepository.save({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    delete savedUser.password;
    return savedUser;
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);

    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    return user;
  }

  async login(existingUser: Readonly<ExistingUserDTO>) {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    delete user.password;

    const jwt = await this.jwtService.signAsync({ user });

    return { token: jwt, user };
  }

  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    if (!jwt) {
      throw new UnauthorizedException();
    }

    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
