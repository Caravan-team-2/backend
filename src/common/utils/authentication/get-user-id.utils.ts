import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AccessTokenPayload } from 'src/authentication/interfaces/access-token-payload.interface';

export const getUserFromContext = (
  ctx: ExecutionContext,
): AccessTokenPayload['user'] => {
  let user: AccessTokenPayload['user'];

  if (ctx.getType() === 'http') {
    user = ctx.switchToHttp().getRequest().user;
  } else if (ctx.getType<any>() === 'graphql') {
    const gqlContext = GqlExecutionContext.create(ctx);
    user = gqlContext.getContext().req.user;
  } else {
    throw new Error('Unsupported context type');
  }
  return user;
};
