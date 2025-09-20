import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { RedisService } from 'nestjs-redis-client';
import { Observable } from 'rxjs';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req as Request;
    const idempotencyKey = req.headers['idempotency-key'] as string;

    // If the header is not present, proceed without any checks.
    // this will allow non safe clients to access the endpoint without issues. for now
    if (!idempotencyKey) {
      return next.handle();
    }

    const keyExists = await this.redisService.get(idempotencyKey);

    // If the key already exists in Redis, it's a duplicate request.
    if (keyExists) {
      throw new ConflictException(
        'A transaction with this idempotency key is already in progress.',
      );
    }

    // Store the key in Redis with a 24-hour expiration to prevent replay attacks
    // and to clean up old keys automatically.
    await this.redisService.set(idempotencyKey, 'in-progress', 86400);

    return next.handle();
  }
}
