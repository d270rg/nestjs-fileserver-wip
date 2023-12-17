import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Reflector } from '@nestjs/core';
import { ITokenPayload } from '../../src/models/i-token-payload';

/**
 * This middleware controls if user is logged in
 */
Injectable();
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<string[]>(
      'secured',
      context.getHandler(),
    );

    if (!secured) {
      return true;
    }

    const token = context.switchToHttp().getRequest() as ITokenPayload;

    if (token.access_token === undefined) {
      throw new NotFoundException({
        message: 'No token provided',
      });
    }

    // TODO: Request to user client
    // const validationResult = await this.natsService.request(
    //   'validate_token',
    //   token.access_token,
    // );

    // if (!validationResult) {
    //   throw new ForbiddenException({
    //     message: 'Invalid token',
    //   });
    // }

    return true;
  }
}
