import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FriendRequestEntity } from '../entities/friend-request.entity';
import { FriendRequestsRepositoryInterface } from '../interfaces/friend-requests.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class FriendRequestsRepository
  extends BaseAbstractRepository<FriendRequestEntity>
  implements FriendRequestsRepositoryInterface
{
  constructor(
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestEntity: Repository<FriendRequestEntity>,
  ) {
    super(friendRequestEntity);
  }
}
