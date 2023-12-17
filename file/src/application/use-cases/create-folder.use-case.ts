import { UseCase } from '@common/use-case';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { hasAccessRights } from '@src/helpers/has-access-rights';
import { AccessMode } from '@src/models/i-access-rights';
import { EntityStorage } from '@src/storage/entity.storage';

@Injectable()
export class CreateFolder extends UseCase {
  public constructor(private entityStorage: EntityStorage) {
    super();
  }
  public async execute(
    userId: string,
    parentFolderId: string,
    name: string,
  ): Promise<void> {
    const parentFolder =
      await this.entityStorage.getVirtualEntity(parentFolderId);
    if (
      parentFolder.ownerId !== userId &&
      hasAccessRights(parentFolder.permissionList, userId, AccessMode.Write)
    ) {
      throw new ForbiddenException(
        `User with id ${userId} has no write access to folder ${parentFolderId}`,
      );
    }
    const newEntityId = await this.entityStorage.createVirtualEntity(
      userId,
      parentFolderId,
      name,
    );
    await this.entityStorage.addUserPermission(
      newEntityId,
      userId,
      AccessMode.ReadWrite,
    );
  }
}
