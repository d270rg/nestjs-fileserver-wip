import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface ICreateEntity {
  isFile?: boolean;

  parentFolderId: string;

  name: string;
}

export class CreateEntityDto implements ICreateEntity {
  @ApiPropertyOptional()
  isFile?: boolean;

  @ApiProperty()
  parentFolderId: string;

  @ApiProperty()
  name: string;
}
