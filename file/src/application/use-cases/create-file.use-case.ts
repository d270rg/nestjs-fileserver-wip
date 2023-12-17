import { UseCase } from '@common/use-case';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { hasAccessRights } from '@src/helpers/has-access-rights';
import { AccessMode } from '@src/models/i-access-rights';
import { EntityStorage } from '@src/storage/entity.storage';
import { FileStorage } from '@src/storage/file.storage';

@Injectable()
export class CreateFile extends UseCase {
  public constructor(
    private entityStorage: EntityStorage,
    private fileStorage: FileStorage,
  ) {
    super();
  }
  public async execute(
    userId: string,
    parentFolderId: string,
    name: string,
    content?: string,
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
    const id = await this.entityStorage.createVirtualEntity(
      userId,
      parentFolderId,
      name,
    );
    await this.fileStorage.createFile(id, content);
  }
}
