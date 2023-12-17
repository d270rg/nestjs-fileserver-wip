import { ApiProperty } from '@nestjs/swagger';

export interface IDeleteEntities {
  entityIds: string[];
}

export class DeleteEntitiesDto implements IDeleteEntities {
  @ApiProperty()
  entityIds: string[];
}
