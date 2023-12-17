import { ICheckResult } from '@src/models/i-check-result';

interface IUsernameCheck {
  checkFunction: (username: string) => boolean;
  failMessage: string;
}
export class UsernameValidators {
  private checks: IUsernameCheck[] = [
    {
      checkFunction: (username: string) => {
        return username.length >= 2;
      },
      failMessage: 'usernameTooShort',
    },
    {
      checkFunction: (username: string) => {
        return username.length <= 20;
      },
      failMessage: 'passwordTooLong',
    },
  ];
  public apply(username: string): ICheckResult {
    for (const check of this.checks) {
      const checkResult = check.checkFunction(username);
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
