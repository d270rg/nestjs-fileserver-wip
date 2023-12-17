import { ICheckResult } from '@src/models/i-check-result';

interface ILoginCheck {
  checkFunction: (login: string) => boolean;
  failMessage: string;
}
export class LoginValidators {
  private checks: ILoginCheck[] = [
    {
      checkFunction: (login: string) => {
        return login.length >= 5;
      },
      failMessage: 'loginTooShort',
    },
    {
      checkFunction: (login: string) => {
        return login.length <= 32;
      },
      failMessage: 'loginTooLong',
    },
  ];
  public apply(login: string): ICheckResult {
    for (const check of this.checks) {
      const checkResult = check.checkFunction(login);
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
