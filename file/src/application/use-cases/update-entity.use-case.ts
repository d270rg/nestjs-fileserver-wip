import { UseCase } from '@common/use-case';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { hasAccessRights } from '@src/helpers/has-access-rights';
import { AccessMode } from '@src/models/i-access-rights';
import { IEntity } from '@src/models/i-entity';
import { EntityStorage } from '@src/storage/entity.storage';

@Injectable()
export class UpdateEntity extends UseCase {
  public constructor(private entityStorage: EntityStorage) {
    super();
  }
  public async execute(updateEntity: IEntity, userId: string): Promise<void> {
    if (
      updateEntity.ownerId !== userId &&
      hasAccessRights(updateEntity.permissionList, userId, AccessMode.Write)
    ) {
      throw new ForbiddenException(
        `User with id ${userId} has no access to entity ${updateEntity.entityId}`,
      );
    }
    await this.entityStorage.updateVirtualEntity(updateEntity);
  }
}
