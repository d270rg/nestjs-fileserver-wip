import { UseCase } from '@common/use-case';
import { Injectable } from '@nestjs/common';
import { AccessMode } from '@src/models/i-access-rights';
import { EntityStorage } from '@src/storage/entity.storage';
import { FileStorage } from '@src/storage/file.storage';

@Injectable()
export class AddUserPermission extends UseCase {
  public constructor(
    private entityStorage: EntityStorage,
    private readonly fileStorage: FileStorage,
  ) {
    super();
  }
  public execute(
    entityId: string,
    userId: string,
    accessMode: AccessMode,
  ): Promise<void> {
    return this.entityStorage.addUserPermission(entityId, userId, accessMode);
  }
}
