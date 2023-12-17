import { AuthGuard } from '@common/guards/AuthGuard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  StreamableFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EntityService } from '@src/application/services/entity.service';
import { AuthUser } from '@src/decorators/user.decorator';
import { CreateEntityDto } from '@src/models/i-create-entity';
import {
  DeleteEntitiesDto,
  IDeleteEntities,
} from '@src/models/i-delete-entities';
import { EntityDto, IEntity } from '@src/models/i-entity';
import { IUserInfo } from '@src/models/i-user-info';

@ApiTags('file')
@Controller('file')
@UseGuards(new AuthGuard(new Reflector()))
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  @ApiOperation({ summary: 'Creates folder entity for given user id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Boolean })
  @ApiBody({ type: CreateEntityDto })
  @ApiBearerAuth('access-token')
  @Put()
  public async createEntity(
    @Body() createEntityDto: CreateEntityDto,
    @AuthUser() user: IUserInfo,
  ): Promise<void> {
    return this.entityService.createEntity(createEntityDto, user.id);
  }

  @ApiOperation({ summary: 'Gets user root folder entity' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: EntityDto,
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'User ID',
    type: String,
  })
  @ApiBearerAuth('access-token')
  @Get('root/:userId')
  public async getUserRoot(@Param('userId') userId: string): Promise<IEntity> {
    return this.entityService.getUserRoot(userId);
  }

  @ApiOperation({
    summary: 'Gets children level of entities from given entity ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved children entities',
    type: [EntityDto],
  })
  @ApiParam({
    name: 'entityId',
    required: true,
    description: 'ID of entity',
    type: String,
  })
  @ApiBearerAuth('access-token')
  @Get('children/:entityId')
  public async getChildren(
    @Param('entityId') entityId: string,
    @AuthUser() user: IUserInfo,
  ): Promise<IEntity[]> {
    return this.entityService.getChildren(entityId, user.id);
  }

  @ApiOperation({ summary: 'Deletes entities in bulk' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiBody({ type: DeleteEntitiesDto })
  @ApiBearerAuth('access-token')
  @Delete('delete')
  public async deleteEntities(
    @Body() deleteEntityIds: IDeleteEntities,
  ): Promise<void> {
    await this.entityService.deleteEntities(deleteEntityIds.entityIds);
  }

  @ApiOperation({ summary: 'Creates root folder for user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'ID of user to create root folder for',
    type: String,
  })
  @ApiBearerAuth('access-token')
  @Put('root/:userId')
  public async createUserRootFolder(
    @Param('userId') userId: string,
  ): Promise<void> {
    console.info('call api file');
    return this.entityService.createUserRootFolder(userId);
  }

  @ApiOperation({ summary: 'Uploads files' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiBearerAuth('access-token')
  @UseInterceptors(AnyFilesInterceptor())
  @Post('upload')
  @ApiParam({
    name: 'parentFolderId',
    required: true,
    description: 'ID of folder to upload files to',
    type: String,
  })
  public async uploadFilesToServer(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @AuthUser() user: IUserInfo,
    @Param() parentFolderId: string,
  ): Promise<void> {
    return this.entityService.uploadEntities(files, user.id, parentFolderId);
  }

  @ApiOperation({ summary: 'Download files' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiBody({ type: [String] })
  @ApiBearerAuth('access-token')
  @Post('download')
  public async downloadFilesFromServer(
    @Body() entityIds: string[],
    @AuthUser() user: IUserInfo,
  ): Promise<StreamableFile> {
    const entities = await this.entityService.downloadEntities(
      entityIds,
      user.id,
    );
    return new StreamableFile(entities);
  }
}
