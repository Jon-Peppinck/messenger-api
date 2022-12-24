import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';

export interface BaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: T): Promise<T>;
  saveMany(data: T[]): Promise<T[]>;
  findOneById(id: number | string): Promise<T>;
  findByCondition(filterCondition: FindOneOptions<T>): Promise<T>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  remove(data: T): Promise<T>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  preload(entityLike: DeepPartial<T>): Promise<T>;
}
