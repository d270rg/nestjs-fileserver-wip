import fs from 'node:fs';
import { Injectable } from '@nestjs/common';
import { AccessMode } from '@src/models/i-access-rights';
import { ICreateEntity } from '@src/models/i-create-entity';
import { IEntity } from '@src/models/i-entity';
import { AddUserPermission } from '../use-cases/add-user-permission.use-case';
import { CreateFile } from '../use-cases/create-file.use-case';
import { CreateFolder } from '../use-cases/create-folder.use-case';
import { CreateUserRootFolder } from '../use-cases/create-user-root-folder.use-case';
import { DeleteEntities } from '../use-cases/delete-entities.use-case';
import { DownloadEntities } from '../use-cases/download-entities.use-case';
import { GetChildren } from '../use-cases/get-children.use-case';
import { GetUserRoot } from '../use-cases/get-user-root.use-case';
import { RevokeUserPermission } from '../use-cases/revoke-user-permission.use-case';
import { UpdateEntity } from '../use-cases/update-entity.use-case';
import { UploadEntities } from '../use-cases/upload-entities.use-case';
@Injectable()
export class EntityService {
  public constructor(
    private readonly createFileUseCase: CreateFile,
    private readonly createFolderUseCase: CreateFolder,
    private readonly createUserRootFolderUseCase: CreateUserRootFolder,
    private readonly getChildrenUseCase: GetChildren,
    private readonly updateEntityUseCase: UpdateEntity,
    private readonly getUserRootUseCase: GetUserRoot,
    private readonly deleteEntitiesUseCase: DeleteEntities,
    private readonly addUserPermissionUseCase: AddUserPermission,
    private readonly revokeUserPermissionUseCase: RevokeUserPermission,
    private readonly downloadEntitiesUseCase: DownloadEntities,
    private readonly uploadEntitiesUseCase: UploadEntities,
  ) {}

  public async createEntity(
    createEntityDto: ICreateEntity,
    userId: string,
  ): Promise<void> {
    const indexChildren = await this.getChildrenUseCase.execute(
      createEntityDto.parentFolderId,
      userId,
    );
    const duplicate = indexChildren.find((virtualEntity: IEntity) => {
      return (
        virtualEntity.name === createEntityDto.name &&
        virtualEntity.isFile === createEntityDto.isFile
      );
    });
    if (duplicate !== undefined) {
      return this.updateEntityUseCase.execute(
        {
          ...duplicate,
          ...createEntityDto,
        },
        userId,
      );
    }

    if (createEntityDto.isFile) {
      return this.createFileUseCase.execute(
        userId,
        createEntityDto.parentFolderId,
        createEntityDto.name,
      );
    } else {
      return this.createFolderUseCase.execute(
        userId,
        createEntityDto.parentFolderId,
        createEntityDto.name,
      );
    }
  }

  public async getUserRoot(userId: string): Promise<IEntity> {
    return this.getUserRootUseCase.execute(userId);
  }

  public async createUserRootFolder(userId: string): Promise<void> {
    return this.createUserRootFolderUseCase.execute(userId);
  }

  public async getChildren(
    entityId: string,
    userId: string,
  ): Promise<IEntity[]> {
    return this.getChildrenUseCase.execute(entityId, userId);
  }

  public async deleteEntities(entityIds: string[]): Promise<void> {
    return this.deleteEntitiesUseCase.execute(entityIds);
  }

  public async addUserPermission(
    entityId: string,
    userId: string,
    accessMode: AccessMode,
  ): Promise<void> {
    return this.addUserPermissionUseCase.execute(entityId, userId, accessMode);
  }

  public async revokeUserPermission(
    entityId: string,
    userId: string,
  ): Promise<void> {
    return this.revokeUserPermissionUseCase.execute(entityId, userId);
  }

  public async uploadEntities(
    uploadedFiles: Express.Multer.File[],
    userId: string,
    parentFolderId: string,
  ): Promise<void> {
    return this.uploadEntitiesUseCase.execute(
      uploadedFiles,
      userId,
      parentFolderId,
    );
  }

  public downloadEntities(
    entityIds: string | string[],
    userId: string,
  ): Promise<fs.ReadStream> {
    return this.downloadEntitiesUseCase.execute(entityIds, userId);
  }
}
