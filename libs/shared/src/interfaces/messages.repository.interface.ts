import { BaseInterfaceRepository } from '@app/shared';

import { MessageEntity } from '../entities/message.entity';

export interface MessagesRepositoryInterface
  extends BaseInterfaceRepository<MessageEntity> {}
