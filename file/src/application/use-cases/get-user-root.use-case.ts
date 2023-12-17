import { UseCase } from '@common/use-case';
import { Injectable } from '@nestjs/common';
import { IEntity } from '@src/models/i-entity';
import { EntityStorage } from '@src/storage/entity.storage';

@Injectable()
export class GetUserRoot extends UseCase {
  public constructor(private entityStorage: EntityStorage) {
    super();
  }
  public async execute(userId: string): Promise<IEntity> {
    return this.entityStorage.getUserRoot(userId);
  }
}
