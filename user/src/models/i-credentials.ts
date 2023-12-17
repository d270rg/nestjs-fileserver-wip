import { ApiProperty } from '@nestjs/swagger';

export class IUser {
  id: string;
  login: string;
  username: string;
  password: string;
}

export class UserDto implements IUser {
  @ApiProperty()
  id: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
