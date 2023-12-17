import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '@src/models/i-credentials';

@Injectable()
export class TokenService {
  public constructor(private jwtService: JwtService) {}

  public async decodeToken(token: string): Promise<IUser> {
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_KEY,
      });

      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
