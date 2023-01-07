import { BaseInterfaceRepository } from '@app/shared';

import { UserEntity } from '../entities/user.entity';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {}
