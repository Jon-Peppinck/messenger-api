import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { MessageEntity } from '../entities/message.entity';
import { MessagesRepositoryInterface } from '../interfaces/messages.repository.interface';
import { BaseAbstractRepository } from './base/base.abstract.repository';

@Injectable()
export class MessagesRepository
  extends BaseAbstractRepository<MessageEntity>
  implements MessagesRepositoryInterface
{
  constructor(
    @InjectRepository(MessageEntity)
    private readonly MessageEntity: Repository<MessageEntity>,
  ) {
    super(MessageEntity);
  }
}
