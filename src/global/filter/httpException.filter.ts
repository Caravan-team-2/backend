import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  success: boolean;
  timestamp: string;
  path?: string;
  method?: string;
  requestId?: string;
  details?: any;
}

interface GraphQLErrorResponse {
  message: string;
  extensions: {
    code: string;
    statusCode: number;
    timestamp: string;
    path?: string;
    requestId?: string;
    details?: any;
    exception?: {
      stacktrace?: string[];
    };
  };
}

@Catch(HttpException)
export class UniversalHttpExceptionFilter
  implements ExceptionFilter, GqlExceptionFilter
{
  private readonly logger = new Logger(UniversalHttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): any {
    const contextType = host.getType<'http' | 'graphql'>();

    if (contextType === 'graphql') {
      return this.handleGraphQLException(exception, host);
    } else {
      return this.handleHttpException(exception, host);
    }
  }

  private handleHttpException(
    exception: HttpException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const requestId = this.extractRequestId(request);

    // Extract message from exception response
    let message: string | string[];
    let details: any = null;

    if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || exception.message;
      details = {
        error: responseObj.error,
        details: responseObj.details,
        validation: responseObj.validation,
      };
    } else {
      message = exceptionResponse || exception.message;
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error: HttpStatus[status] || 'Unknown Error',
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      requestId,
      details: details || undefined,
    };

    // Log the error
    this.logHttpError(exception, request, status, requestId);

    response.status(status).json(errorResponse);
  }

  private handleGraphQLException(
    exception: HttpException,
    host: ArgumentsHost,
  ): GraphQLError {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();
    const context = gqlHost.getContext();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const requestId = this.extractRequestId(context.req);

    // Extract message and details
    let message: string;
    let details: any = null;

    if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as any;
      message = Array.isArray(responseObj.message)
        ? responseObj.message.join(', ')
        : responseObj.message || exception.message;
      details = {
        validation: responseObj.validation,
        details: responseObj.details,
      };
    } else {
      message = exceptionResponse || exception.message;
    }

    // Log the GraphQL error
    this.logGraphQLError(exception, info, status, requestId);

    // Create GraphQL-formatted error
    const graphqlError = new GraphQLError(message, {
      extensions: {
        code: this.getGraphQLErrorCode(status),
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: info.path,
        requestId,
        details: details || undefined,
        exception:
          process.env.NODE_ENV === 'development'
            ? {
                stacktrace: exception.stack?.split('\n'),
              }
            : undefined,
      },
    });

    return graphqlError;
  }

  private logHttpError(
    exception: HttpException,
    request: Request,
    status: number,
    requestId?: string,
  ): void {
    const errorInfo = {
      type: 'HTTP_EXCEPTION',
      requestId,
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      statusCode: status,
      message: exception.message,
      userAgent: request.headers['user-agent'],
      ip: this.extractClientIp(request),
      stack: exception.stack,
      cause: exception.cause,
    };

    if (status >= 500) {
      this.logger.error(
        `🚨 [HTTP ERROR] ${JSON.stringify(errorInfo, null, 2)}`,
      );
    } else if (status >= 400) {
      this.logger.warn(
        `⚠️ [HTTP WARNING] ${JSON.stringify(errorInfo, null, 2)}`,
      );
    } else {
      this.logger.log(`ℹ️ [HTTP INFO] ${JSON.stringify(errorInfo, null, 2)}`);
    }
  }

  private logGraphQLError(
    exception: HttpException,
    info: any,
    status: number,
    requestId?: string,
  ): void {
    const errorInfo = {
      type: 'GRAPHQL_EXCEPTION',
      requestId,
      timestamp: new Date().toISOString(),
      operationType: info.operation?.operation,
      operationName: info.operation?.name?.value || 'Anonymous',
      fieldName: info.fieldName,
      path: info.path,
      statusCode: status,
      message: exception.message,
      stack: exception.stack,
      cause: exception.cause,
    };

    if (status >= 500) {
      this.logger.error(
        `🚨 [GRAPHQL ERROR] ${JSON.stringify(errorInfo, null, 2)}`,
      );
    } else if (status >= 400) {
      this.logger.warn(
        `⚠️ [GRAPHQL WARNING] ${JSON.stringify(errorInfo, null, 2)}`,
      );
    } else {
      this.logger.log(
        `ℹ️ [GRAPHQL INFO] ${JSON.stringify(errorInfo, null, 2)}`,
      );
    }
  }

  private getGraphQLErrorCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_USER_INPUT';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHENTICATED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'VALIDATION_ERROR';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'RATE_LIMITED';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'INTERNAL_SERVER_ERROR';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'SERVICE_UNAVAILABLE';
      default:
        return 'UNKNOWN_ERROR';
    }
  }

  private extractClientIp(request: any): string {
    return (
      request?.headers['cf-connecting-ip'] ||
      request?.headers['x-real-ip'] ||
      request?.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request?.connection?.remoteAddress ||
      request?.socket?.remoteAddress ||
      request?.ip ||
      'Unknown'
    );
  }

  private extractRequestId(request: any): string | undefined {
    return (
      request?.headers['x-request-id'] ||
      request?.headers['request-id'] ||
      request?.requestId
    );
  }
}

// Custom exception classes for better error handling
export class ValidationException extends HttpException {
  constructor(errors: string[] | Record<string, string[]>) {
    const message = Array.isArray(errors) ? errors : 'Validation failed';
    super(
      {
        message,
        error: 'Validation Error',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        validation: errors,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class BusinessLogicException extends HttpException {
  constructor(message: string, details?: any) {
    super(
      {
        message,
        error: 'Business Logic Error',
        statusCode: HttpStatus.BAD_REQUEST,
        details,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ResourceNotFoundException extends HttpException {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;

    super(
      {
        message,
        error: 'Resource Not Found',
        statusCode: HttpStatus.NOT_FOUND,
        details: { resource, identifier },
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class AuthenticationException extends HttpException {
  constructor(message: string = 'Authentication required') {
    super(
      {
        message,
        error: 'Authentication Error',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class AuthorizationException extends HttpException {
  constructor(message: string = 'Insufficient permissions') {
    super(
      {
        message,
        error: 'Authorization Error',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class RateLimitException extends HttpException {
  constructor(limit: number, windowMs: number) {
    super(
      {
        message: `Rate limit exceeded. Maximum ${limit} requests per ${windowMs / 1000} seconds`,
        error: 'Rate Limit Exceeded',
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        details: { limit, windowMs },
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
