import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthUser = createParamDecorator((_data, req: ExecutionContext) => {
  return req.getArgs()[0].user;
});
