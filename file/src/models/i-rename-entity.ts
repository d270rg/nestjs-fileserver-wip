import { ApiProperty } from '@nestjs/swagger';

export interface IRenameEntity {
  entityId: string;
  newName: string;
}

export class RenameEntityDto implements IRenameEntity {
  @ApiProperty()
  entityId: string;

  @ApiProperty()
  newName: string;
}
