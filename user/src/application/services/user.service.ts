import { FileService } from '@common/clients/nest/file';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenPayload } from '@src/models/i-token-payload';
import { UserStorage } from '@src/storage/user.storage';
import * as bcrypt from 'bcrypt';
import { lastValueFrom } from 'rxjs';
import { ValidatorService } from './validator.service';

@Injectable()
export class UserService {
  public constructor(
    private userStorage: UserStorage,
    private validatorService: ValidatorService,
    private jwtService: JwtService,
    private fileService: FileService,
  ) {}
  public async register(
    login: string,
    username: string,
    password: string,
  ): Promise<ITokenPayload> {
    const loginValidationResult = this.validatorService.validateLogin(login);
    if (!loginValidationResult.result) {
      throw new UnauthorizedException(loginValidationResult.message);
    }
    const usernameValidationResult =
      this.validatorService.validateUsername(username);
    if (!usernameValidationResult.result) {
      throw new UnauthorizedException(usernameValidationResult.message);
    }
    const passwordValidationResult =
      this.validatorService.validatePassword(password);
    if (!passwordValidationResult.result) {
      throw new UnauthorizedException(passwordValidationResult.message);
    }

    const existingLogin = await this.userStorage.getUserByLogin(login);
    const existingUsername = await this.userStorage.getUserByUsername(username);

    if (existingLogin) {
      throw new ConflictException('loginAlreadyExists');
    }

    if (existingUsername) {
      throw new ConflictException('usernameAlreadyExists');
    }

    const id = await this.userStorage.createUser(login, username, password);
    await lastValueFrom(this.fileService.createUserRootFolder(id));

    return {
      access_token: this.jwtService.sign({ login, username, id }),
      login,
      username,
      id,
    };
  }

  public async login(login: string, password: string): Promise<ITokenPayload> {
    const user = await this.userStorage.getUserByLogin(login);

    if (!user) {
      throw new NotFoundException('loginNotExists');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('wrongPassword');
    }

    return {
      access_token: this.jwtService.sign({
        login,
        username: user.username,
        id: user.id,
      }),
      login,
      username: user.username,
      id: user.id,
    };
  }

  public async loginExistance(login: string): Promise<boolean> {
    const user = await this.userStorage.getUserByLogin(login);

    return !!user;
  }

  public async usernameExistance(username: string): Promise<boolean> {
    const user = await this.userStorage.getUserByUsername(username);

    return !!user;
  }
}
