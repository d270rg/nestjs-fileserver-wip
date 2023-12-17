import { ApiProperty } from '@nestjs/swagger';

export interface IUserInfo {
  id: string;
  login: string;
  username: string;
  password: string;
}

export class UserInfoDto implements IUserInfo {
  @ApiProperty()
  id: string;
  @ApiProperty()
  login: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
