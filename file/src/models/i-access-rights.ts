import { ApiProperty } from '@nestjs/swagger';

export enum AccessMode {
  View = 0,
  Read = 1,
  Write = 2,
  ReadWrite = 3,
}

export interface IAccessRights {
  permissions: {
    [userId: string]: AccessMode;
  };
}

export class AccessRightsDto implements IAccessRights {
  @ApiProperty()
  permissions: Record<string, AccessMode>;
}
