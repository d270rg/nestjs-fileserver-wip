import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IAccessRights } from './i-access-rights';

export interface IEntity {
  id: string;
  name: string;
  ownerId: string;
  parentFolderId?: string;
  isFile?: boolean;
  meta: Record<string, unknown>;
  permissionList?: IAccessRights;
}

export class EntityDto implements IEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ownerId: string;

  @ApiPropertyOptional()
  parentFolderId?: string;

  @ApiPropertyOptional()
  isFile?: boolean;

  @ApiProperty()
  meta: Record<string, unknown>;

  @ApiPropertyOptional()
  permissionList?: IAccessRights;
}
