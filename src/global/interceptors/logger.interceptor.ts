import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';

interface LogContext {
  requestId: string;
  timestamp: string;
  userIp: string;
  userAgent: string;
  protocol: 'REST' | 'GraphQL';
}

interface RestLogData extends LogContext {
  method: string;
  url: string;
  path: string;
  headers: Record<string, any>;
  query: Record<string, any>;
  body: any;
  statusCode?: number;
  responseHeaders?: Record<string, any>;
  responseBody?: any;
  responseTime: number;
}

interface GraphQLLogData extends LogContext {
  operationType: string;
  operationName: string;
  fieldName: string;
  query: string;
  variables: any;
  responseData?: any;
  errors?: any[];
  responseTime: number;
}

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);
  private readonly sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'auth',
    'authorization',
    'credential',
    'apikey',
    'api_key',
    'access_token',
    'refresh_token',
    'session',
    'cookie',
    'x-api-key',
    'bearer',
  ];

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const requestId = uuidv4();
    const startTime = Date.now();
    const contextType = context.getType<'http' | 'graphql'>();

    if (contextType === 'graphql') {
      return this.handleGraphQLLogging(context, next, requestId, startTime);
    } else {
      return this.handleRestLogging(context, next, requestId, startTime);
    }
  }

  private handleRestLogging(
    context: ExecutionContext,
    next: CallHandler<any>,
    requestId: string,
    startTime: number,
  ): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const logContext: LogContext = {
      requestId,
      timestamp: new Date().toISOString(),
      userIp: this.extractClientIp(request),
      userAgent: request.headers['user-agent'] || 'Unknown',
      protocol: 'REST',
    };

    const requestLogData: Partial<RestLogData> = {
      ...logContext,
      method: request.method,
      url: request.url,
      path: request.path,
      headers: this.sanitizeData(request.headers),
      query: this.sanitizeData(request.query),
      body: this.sanitizeData(request.body),
      responseTime: 0,
    };

    // Log incoming request
    this.logRestRequest(requestLogData as RestLogData);

    return next.handle().pipe(
      tap((responseData) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const responseLogData: RestLogData = {
          ...requestLogData,
          statusCode: response.statusCode,
          responseHeaders: this.sanitizeData(this.getResponseHeaders(response)),
          responseBody: this.sanitizeData(responseData),
          responseTime,
        } as RestLogData;

        this.logRestResponse(responseLogData, 'SUCCESS');
      }),
      catchError((error) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const errorLogData: RestLogData = {
          ...requestLogData,
          statusCode: error.status || 500,
          responseBody: {
            error: error.message,
            stack: error.stack?.split('\n').slice(0, 5), // First 5 lines of stack
          },
          responseTime,
        } as RestLogData;

        this.logRestResponse(errorLogData, 'ERROR');
        return throwError(() => error);
      }),
    );
  }

  private handleGraphQLLogging(
    context: ExecutionContext,
    next: CallHandler<any>,
    requestId: string,
    startTime: number,
  ): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const request = gqlContext.getContext().req;
    const args = gqlContext.getArgs();

    const logContext: LogContext = {
      requestId,
      timestamp: new Date().toISOString(),
      userIp: this.extractClientIp(request),
      userAgent: request?.headers['user-agent'] || 'Unknown',
      protocol: 'GraphQL',
    };

    const requestLogData: Partial<GraphQLLogData> = {
      ...logContext,
      operationType: info.operation.operation,
      operationName: info.operation.name?.value || 'Anonymous',
      fieldName: info.fieldName,
      query: this.formatGraphQLQuery(info.operation),
      variables: this.sanitizeData(args),
      responseTime: 0,
    };

    // Log incoming GraphQL operation
    this.logGraphQLRequest(requestLogData as GraphQLLogData);

    return next.handle().pipe(
      tap((responseData) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const responseLogData: GraphQLLogData = {
          ...requestLogData,
          responseData: this.sanitizeData(responseData),
          responseTime,
        } as GraphQLLogData;

        this.logGraphQLResponse(responseLogData, 'SUCCESS');
      }),
      catchError((error) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const errorLogData: GraphQLLogData = {
          ...requestLogData,
          errors: [
            {
              message: error.message,
              extensions: error.extensions,
              path: error.path,
              stack: error.stack?.split('\n').slice(0, 5),
            },
          ],
          responseTime,
        } as GraphQLLogData;

        this.logGraphQLResponse(errorLogData, 'ERROR');
        return throwError(() => error);
      }),
    );
  }

  private logRestRequest(data: RestLogData): void {
    const logMessage = {
      message: '🚀 [REST REQUEST]',
      requestId: data.requestId,
      timestamp: data.timestamp,
      method: data.method,
      url: data.url,
      path: data.path,
      userIp: data.userIp,
      userAgent: data.userAgent,
      headers: data.headers,
      queryParams: data.query,
      body: data.body,
    };

    this.logger.log(JSON.stringify(logMessage, null, 2));
  }

  private logRestResponse(
    data: RestLogData,
    status: 'SUCCESS' | 'ERROR',
  ): void {
    const emoji = status === 'SUCCESS' ? '✅' : '❌';
    const performanceEmoji = this.getPerformanceEmoji(data.responseTime);

    const logMessage = {
      message: `${emoji} [REST RESPONSE] ${performanceEmoji}`,
      requestId: data.requestId,
      method: data.method,
      path: data.path,
      statusCode: data.statusCode,
      responseTime: `${data.responseTime}ms`,
      responseHeaders: data.responseHeaders,
      responseBody: data.responseBody,
      dataSize: this.calculateDataSize(data.responseBody),
    };

    if (status === 'SUCCESS') {
      this.logger.log(JSON.stringify(logMessage, null, 2));
    } else {
      this.logger.error(JSON.stringify(logMessage, null, 2));
    }
  }

  private logGraphQLRequest(data: GraphQLLogData): void {
    const logMessage = {
      message: '🎯 [GRAPHQL REQUEST]',
      requestId: data.requestId,
      timestamp: data.timestamp,
      operationType: data.operationType.toUpperCase(),
      operationName: data.operationName,
      fieldName: data.fieldName,
      userIp: data.userIp,
      userAgent: data.userAgent,
      query: data.query,
      variables: data.variables,
    };

    this.logger.log(JSON.stringify(logMessage, null, 2));
  }

  private logGraphQLResponse(
    data: GraphQLLogData,
    status: 'SUCCESS' | 'ERROR',
  ): void {
    const emoji = status === 'SUCCESS' ? '✅' : '❌';
    const performanceEmoji = this.getPerformanceEmoji(data.responseTime);

    const logMessage = {
      message: `${emoji} [GRAPHQL RESPONSE] ${performanceEmoji}`,
      requestId: data.requestId,
      operationType: data.operationType.toUpperCase(),
      operationName: data.operationName,
      fieldName: data.fieldName,
      responseTime: `${data.responseTime}ms`,
      responseData: data.responseData,
      errors: data.errors,
      dataSize: this.calculateDataSize(data.responseData),
    };

    if (status === 'SUCCESS') {
      this.logger.log(JSON.stringify(logMessage, null, 2));
    } else {
      this.logger.error(JSON.stringify(logMessage, null, 2));
    }
  }

  private extractClientIp(request: any): string {
    return (
      request.headers['cf-connecting-ip'] ||
      request.headers['x-real-ip'] ||
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      'Unknown'
    );
  }

  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeData(item));
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = this.sensitiveFields.some(
        (field) => lowerKey.includes(field) || lowerKey === field,
      );

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value);
      } else if (typeof value === 'string' && value.length > 1000) {
        // Truncate very long strings
        sanitized[key] = value.substring(0, 1000) + '... [TRUNCATED]';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private getResponseHeaders(response: Response): Record<string, any> {
    const headers = {};
    if (response.getHeaders) {
      const responseHeaders = response.getHeaders();
      Object.keys(responseHeaders).forEach((key) => {
        headers[key] = responseHeaders[key];
      });
    }
    return headers;
  }

  private formatGraphQLQuery(operation: any): string {
    try {
      // Basic query formatting - you might want to use a proper GraphQL printer
      const operationType = operation.operation;
      const operationName = operation.name?.value || '';
      const selections = operation.selectionSet?.selections || [];

      const fields = selections
        .map((selection) => {
          if (selection.name) {
            return selection.name.value;
          }
          return 'unknown';
        })
        .join(', ');

      return `${operationType} ${operationName} { ${fields} }`;
    } catch (error) {
      return 'Unable to format query';
    }
  }

  private getPerformanceEmoji(responseTime: number): string {
    if (responseTime < 100) return '🚀';
    if (responseTime < 300) return '⚡';
    if (responseTime < 1000) return '🌀';
    if (responseTime < 3000) return '🐌';
    return '🐢';
  }

  private calculateDataSize(data: any): string {
    if (!data) return '0 bytes';

    try {
      const jsonString = JSON.stringify(data);
      const bytes = new Blob([jsonString]).size;

      if (bytes < 1024) return `${bytes} bytes`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } catch {
      return 'Unknown size';
    }
  }
}
