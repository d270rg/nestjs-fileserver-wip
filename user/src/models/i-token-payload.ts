import { ApiProperty } from '@nestjs/swagger';

export interface ITokenPayload {
  access_token: string;
  login: string;
  username: string;
  id: string;
}
export class TokenPayloadDto implements ITokenPayload {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  id: string;
}
