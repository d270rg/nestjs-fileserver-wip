import { Injectable } from '@nestjs/common';
import { ICheckResult } from '@src/models/i-check-result';
import { LoginValidators } from '../validators/login.validator';
import { PasswordValidators } from '../validators/password.validator';
import { UsernameValidators } from '../validators/username.validator';

@Injectable()
export class ValidatorService {
  public validateLogin(login: string): ICheckResult {
    const loginValidators = new LoginValidators();
    return loginValidators.apply(login);
  }
  public validateUsername(username: string): ICheckResult {
    const usernameValidators = new UsernameValidators();
    return usernameValidators.apply(username);
  }
  public validatePassword(password: string): ICheckResult {
    const passwordValidators = new PasswordValidators();
    return passwordValidators.apply(password);
  }
}
