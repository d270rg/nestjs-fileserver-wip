import { CommonModule } from '@common/common.module';
import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { EntityService } from '@src/application/services/entity.service';
import { CreateFile } from '@src/application/use-cases/create-file.use-case';
import { CreateFolder } from '@src/application/use-cases/create-folder.use-case';
import { CreateUserRootFolder } from '@src/application/use-cases/create-user-root-folder.use-case';
import { DeleteEntities } from '@src/application/use-cases/delete-entities.use-case';
import { GetChildren } from '@src/application/use-cases/get-children.use-case';
import { GetUserRoot } from '@src/application/use-cases/get-user-root.use-case';
import { UpdateEntity } from '@src/application/use-cases/update-entity.use-case';
import { EntityController } from '@src/presentation/files.controller';
import { EntityStorage } from '@src/storage/entity.storage';
import { FileStorage } from '@src/storage/file.storage';
import * as dotenv from 'dotenv';
import { DownloadEntities } from './application/use-cases/download-entities.use-case';
dotenv.config({ path: '../.env' });

@Module({
  imports: [
    Reflector,
    JwtModule.register({
      secret: process.env.JWT_KEY,
    }),
    CommonModule,
  ],
  controllers: [EntityController],
  providers: [
    // Application Services
    EntityService,
    // Use-cases
    CreateFile,
    CreateFolder,
    CreateUserRootFolder,
    DeleteEntities,
    GetChildren,
    GetUserRoot,
    UpdateEntity,
    DownloadEntities,
    // Storages
    FileStorage,
    EntityStorage,
  ],
})
export class FileModule {}
