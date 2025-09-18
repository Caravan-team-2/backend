import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';

export const USER = createParamDecorator(
  (data: keyof AccessTokenPayload['user'], ctx: ExecutionContext) => {
    let user: AccessTokenPayload['user'];

    if (ctx.getType() === 'http') {
      user = ctx.switchToHttp().getRequest().user;
    } else if (ctx.getType<any>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(ctx);
      user = gqlContext.getContext().req.user;
    }
    else {
      throw new Error('Unsupported context type');
    }


    if (!user) {
      // Or handle as per your application's needs, maybe return null or a default user
      throw new Error('User not found in request context');
    }

    return data ? user[data] : user;
  },
);
