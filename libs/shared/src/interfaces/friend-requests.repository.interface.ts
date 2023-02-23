import { BaseInterfaceRepository } from '@app/shared';

import { FriendRequestEntity } from '../entities/friend-request.entity';

export interface FriendRequestsRepositoryInterface
  extends BaseInterfaceRepository<FriendRequestEntity> {}
