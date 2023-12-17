import { UseCase } from '@common/use-case';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hasAccessRights } from '@src/helpers/has-access-rights';
import { AccessMode } from '@src/models/i-access-rights';
import { IEntity } from '@src/models/i-entity';
import { EntityStorage } from '@src/storage/entity.storage';
import { FileStorage } from '@src/storage/file.storage';

@Injectable()
export class GetChildren extends UseCase {
  public constructor(
    private entityStorage: EntityStorage,
    private readonly fileStorage: FileStorage,
  ) {
    super();
  }
  public async execute(entityId: string, userId: string): Promise<IEntity[]> {
    const parentEntity = await this.entityStorage.getVirtualEntity(entityId);

    if (parentEntity === undefined) {
      throw new NotFoundException(`Entity with id ${entityId} not found`);
    }

    // Check access for parent. Minimal share access right for parent folder is AccessMode.View
    // it is given to parent folder non-recursively if one of it's children was shared
    if (
      parentEntity.ownerId !== userId &&
      !hasAccessRights(parentEntity.permissionList, userId, AccessMode.View)
    ) {
      throw new ForbiddenException(
        `User with id ${userId} has no required minimal access to parent folder ${entityId}`,
      );
    }

    const virtualChildren =
      await this.entityStorage.getVirtualEntityChildren(entityId);

    const children: IEntity[] = [];

    for (const child of virtualChildren) {
      let fileProperties: Record<string, unknown>;

      // Check access for children. Minimal share access right is AccessMode.Read
      // It is given to single file or folder when it is shared
      if (
        child.ownerId !== userId &&
        !hasAccessRights(parentEntity.permissionList, userId, AccessMode.Read)
      ) {
        continue;
      }

      if (child.isFile) {
        fileProperties = await this.fileStorage.getFileProperty(child.entityId);
      }

      children.push({
        ...child,
        meta: fileProperties,
      });
    }

    return children;
  }
}
