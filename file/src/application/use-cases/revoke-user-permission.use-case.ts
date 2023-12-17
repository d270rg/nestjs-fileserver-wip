import { UseCase } from '@common/use-case';
import { Injectable } from '@nestjs/common';
import { EntityStorage } from '@src/storage/entity.storage';
import { FileStorage } from '@src/storage/file.storage';

@Injectable()
export class RevokeUserPermission extends UseCase {
  public constructor(
    private entityStorage: EntityStorage,
    private readonly fileStorage: FileStorage,
  ) {
    super();
  }
  public execute(entityId: string, userId: string): Promise<void> {
    return this.entityStorage.revokeUserPermission(entityId, userId);
  }
}
