import { UseCase } from '@common/use-case';
import { Injectable } from '@nestjs/common';
import { EntityStorage } from '@src/storage/entity.storage';
import { FileStorage } from '@src/storage/file.storage';

@Injectable()
export class DeleteEntities extends UseCase {
  public constructor(
    private entityStorage: EntityStorage,
    private readonly fileStorage: FileStorage,
  ) {
    super();
  }
  public async execute(virtualEntityIds: string[]): Promise<void> {
    await this.entityStorage.deleteVirtualEntities(virtualEntityIds);
    await this.fileStorage.deleteFiles(virtualEntityIds);
  }
}
