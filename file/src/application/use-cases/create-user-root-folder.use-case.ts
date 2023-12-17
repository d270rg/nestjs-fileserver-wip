import { UseCase } from '@common/use-case';
import { Injectable } from '@nestjs/common';
import { AccessMode } from '@src/models/i-access-rights';
import { EntityStorage } from '@src/storage/entity.storage';

@Injectable()
export class CreateUserRootFolder extends UseCase {
  public constructor(private entityStorage: EntityStorage) {
    super();
  }
  public async execute(userId: string): Promise<void> {
    try {
      await this.entityStorage.getUserRoot(userId);
      throw new Error(`User root ${userId} already exists!`);
    } catch (e) {
      const entityId = await this.entityStorage.createVirtualRootEntity(userId);
      await this.entityStorage.addUserPermission(
        entityId,
        userId,
        AccessMode.ReadWrite,
      );
    }
  }
}
