import { Injectable, NotFoundException } from '@nestjs/common';
import { AccessMode } from '@src/models/i-access-rights';
import { IEntity } from '@src/models/i-entity';
import { IEntityTree } from '@src/models/i-entity-tree';
import mongoose from 'mongoose';
import { FileStorage } from './file.storage';
import { VirtualEntityModel } from './schemas/virtual-entity.schema';

@Injectable()
export class EntityStorage {
  public constructor(private readonly fileStorage: FileStorage) {}

  public async createVirtualRootEntity(ownerId: string): Promise<string> {
    const entityInfo = new VirtualEntityModel({
      ownerId,
    });
    await entityInfo.save();
    return entityInfo.id.toString();
  }

  public async createVirtualEntity(
    ownerId: string,
    parentFolderId: string,
    name: string,
    isFile?: boolean,
    contents?: Buffer,
  ): Promise<string> {
    const entityInfo = new VirtualEntityModel({
      name,
      parentFolderId,
      ownerId,
    });

    await entityInfo.save();

    if (isFile) {
      await this.fileStorage.createFile(entityInfo.id, contents);
    }

    return entityInfo.id.toString();
  }

  public async moveVirtualEntity(
    id: string,
    newParentId: string,
  ): Promise<void> {
    const foldersFound = await VirtualEntityModel.findOne({
      id: newParentId,
    }).countDocuments();
    if (foldersFound === 0) {
      throw new Error(`Folder with id ${id} doesn't exist`);
    }
    await VirtualEntityModel.findOneAndUpdate(
      { id },
      { $set: { parentFolderId: newParentId } },
    );
  }

  public async updateVirtualEntity(updateEntity: IEntity): Promise<void> {
    await VirtualEntityModel.findOneAndUpdate(
      { id: updateEntity.id },
      { $set: updateEntity },
    );
  }

  public async getVirtualEntity(virtualEntityId: string): Promise<IEntity> {
    const child = await VirtualEntityModel.findOne({
      id: virtualEntityId,
    })
      .lean()
      .exec();

    return child;
  }

  public async getVirtualEntityChildren(
    virtualEntityId: string,
  ): Promise<IEntity[]> {
    const children = await VirtualEntityModel.find({
      parentFolderId: virtualEntityId,
    })
      .lean()
      .exec();

    return children;
  }

  public async getVirtualEntityChildrenRecursive(
    id: string,
  ): Promise<IEntityTree> {
    const startEntity = await this.getVirtualEntity(id);
    const subEntities = (await VirtualEntityModel.find<IEntity[]>({
      parentFolderId: startEntity.id,
    })
      .lean()
      .exec()) as IEntity[];

    const children = subEntities.map((entity) => ({
      entity,
    }));

    const entityTree: IEntityTree = {
      entity: startEntity,
      children,
    };

    await Promise.all(
      entityTree.children.map(async (treeChild) => {
        const children = await this.getVirtualEntityChildrenRecursive(
          treeChild.entity.id,
        );
        return {
          child: treeChild,
          children,
        };
      }),
    );

    return entityTree;
  }

  public async getUserRoot(userId: string): Promise<IEntity> {
    const userObjectId = new mongoose.mongo.ObjectId(userId);
    const child = await VirtualEntityModel.findOne({
      ownerId: userObjectId,
      parentId: { $exists: false },
    })
      .lean()
      .exec();

    if (!child) {
      throw new NotFoundException(
        `User root folder not found for userId, ${userId}`,
      );
    }

    return child;
  }

  public async addUserPermission(
    entityId: string,
    userId: string,
    accessMode: AccessMode,
  ) {
    await VirtualEntityModel.findOneAndUpdate(
      { id: entityId },
      { $set: { [`permissionList.${userId}`]: accessMode } },
    );
  }

  public async checkUserPermissions(
    userId: string,
    entityIds: string[],
    accessMode: AccessMode,
  ): Promise<Record<string, boolean>> {
    const entities = (await VirtualEntityModel.find({ id: { $in: entityIds } })
      .lean()
      .exec()) as IEntity[];

    return entities.reduce(
      (permissionMap: Record<string, boolean>, entity: IEntity) => {
        permissionMap[entity.id] = entity.permissionList[userId] >= accessMode;
        return permissionMap;
      },
      {} as Record<string, boolean>,
    );
  }

  public async revokeUserPermission(entityId: string, userId: string) {
    await VirtualEntityModel.findOneAndUpdate(
      { id: entityId },
      { $set: { [`permissionList.${userId}`]: undefined } },
    );
  }

  public async deleteVirtualEntities(
    virtualEntityIds: string[],
  ): Promise<void> {
    for (const id of virtualEntityIds) {
      await this.deleteVirtualEntity(id);
    }
  }

  private async deleteVirtualEntity(virtualEntityId: string): Promise<void> {
    const storedEntityChildren =
      await this.getVirtualEntityChildren(virtualEntityId);

    for (const storedChild of storedEntityChildren) {
      await this.deleteVirtualEntity(storedChild.id);
    }

    const entityObjectId = new mongoose.Types.ObjectId(virtualEntityId);

    await VirtualEntityModel.deleteOne({ id: entityObjectId });
  }
}
