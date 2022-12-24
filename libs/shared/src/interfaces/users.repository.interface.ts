import { BaseInterfaceRepository } from '@app/shared/repositories/base/base.interface.repository';
import { UserEntity } from '../entities/user.entity';
export interface UserRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {}
