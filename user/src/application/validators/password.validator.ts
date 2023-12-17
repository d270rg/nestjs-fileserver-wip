import { ICheckResult } from '@src/models/i-check-result';

interface IPasswordCheck {
  checkFunction: (password: string) => boolean;
  failMessage: string;
}
export class PasswordValidators {
  private checks: IPasswordCheck[] = [
    {
      checkFunction: (password: string) => {
        return password.length >= 6;
      },
      failMessage: 'passwordTooShort',
    },
    {
      checkFunction: (password: string) => {
        return password.length <= 64;
      },
      failMessage: 'passwordTooLong',
    },
  ];
  public apply(password: string): ICheckResult {
    for (const check of this.checks) {
      const checkResult = check.checkFunction(password);
      if (!checkResult) {
        return {
          result: false,
          message: check.failMessage,
        };
      }
    }
    return {
      result: true,
    };
  }
}
