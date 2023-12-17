import fs from 'node:fs';
import { isArray } from '@common/helpers/array-ops';
import { UseCase } from '@common/use-case';
import { Injectable } from '@nestjs/common';
import { AccessMode } from '@src/models/i-access-rights';
import { EntityStorage } from '@src/storage/entity.storage';
import { FileStorage } from '@src/storage/file.storage';

@Injectable()
export class DownloadEntities extends UseCase {
  public constructor(
    private entityStorage: EntityStorage,
    private readonly fileStorage: FileStorage,
  ) {
    super();
  }
  public async execute(
    entityIds: string | string[],
    userId: string,
  ): Promise<fs.ReadStream> {
    if (isArray(entityIds)) {
      const userFileAccessPermission =
        await this.entityStorage.checkUserPermissions(
          userId,
          entityIds,
          AccessMode.Read,
        )[0];

      if (userFileAccessPermission[entityIds]) {
        return this.fileStorage.getFiles(entityIds);
      }
    } else {
      const userFileAccessPermissions = this.entityStorage.checkUserPermissions(
        userId,
        [entityIds],
        AccessMode.Read,
      );
      if (userFileAccessPermissions[entityIds]) {
        return this.fileStorage.getFile(entityIds);
      }
    }
  }
}
