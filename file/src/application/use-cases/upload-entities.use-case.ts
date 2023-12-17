import { UseCase } from '@common/use-case';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AccessMode } from '@src/models/i-access-rights';
import { EntityStorage } from '@src/storage/entity.storage';
import { FileStorage } from '@src/storage/file.storage';

@Injectable()
export class UploadEntities extends UseCase {
  public constructor(
    private readonly entityStorage: EntityStorage,
    private readonly fileStorage: FileStorage,
  ) {
    super();
  }
  public async execute(
    uploadedFiles: Express.Multer.File[],
    userId: string,
    parentFolderId: string,
  ): Promise<void> {
    const permissions = await this.entityStorage.checkUserPermissions(
      userId,
      [parentFolderId],
      AccessMode.ReadWrite,
    )[0];

    if (!permissions[parentFolderId]) {
      throw new ForbiddenException(
        `User with id ${userId} has no write access to folder with id ${parentFolderId}`,
      );
    }

    for (const file of uploadedFiles) {
      const newEntityId = await this.entityStorage.createVirtualEntity(
        userId,
        parentFolderId,
        file.originalname,
        true,
        file.buffer,
      );

      await this.entityStorage.addUserPermission(
        newEntityId,
        userId,
        AccessMode.ReadWrite,
      );
    }
  }
}
