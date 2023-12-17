import { ApiProperty } from '@nestjs/swagger';

export interface ICredentials {
  id: string;
  login: string;
  username: string;
}

export class CredentialsDto implements ICredentials {
  @ApiProperty()
  id: string;
  @ApiProperty()
  login: string;
  @ApiProperty()
  username: string;
}
