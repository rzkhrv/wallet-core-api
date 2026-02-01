import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { AdapterError } from './adapter-error';
import { ApiErrorResponse } from './api-error-response';

const STATUS_CODE_MAP: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
  [HttpStatus.NOT_IMPLEMENTED]: 'NOT_IMPLEMENTED',
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, body } = this.normalizeException(exception);
    if (status >= 500) {
      this.logger.error(body.error.message, (exception as Error)?.stack);
    } else {
      this.logger.warn(body.error.message);
    }
    response.status(status).json(body);
  }

  private normalizeException(exception: unknown): {
    status: number;
    body: ApiErrorResponse;
  } {
    if (exception instanceof AdapterError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        body: {
          error: {
            code: exception.code,
            message: exception.message,
            details: exception.details,
          },
        },
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const { message, details, code } = this.extractHttpDetails(
        status,
        response,
        exception.message,
      );

      return {
        status,
        body: {
          error: {
            code,
            message,
            details,
          },
        },
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unexpected error',
        },
      },
    };
  }

  private extractHttpDetails(
    status: number,
    response: unknown,
    fallbackMessage: string,
  ): { message: string; details?: unknown; code: string } {
    if (typeof response === 'string') {
      return {
        message: response,
        code: STATUS_CODE_MAP[status] ?? 'INTERNAL_ERROR',
      };
    }

    if (response && typeof response === 'object') {
      const responseRecord = response as Record<string, unknown>;
      const responseMessage = responseRecord.message;

      if (Array.isArray(responseMessage)) {
        return {
          message: 'Validation failed',
          details: { messages: responseMessage },
          code: 'VALIDATION_ERROR',
        };
      }

      if (typeof responseMessage === 'string') {
        return {
          message: responseMessage,
          code: STATUS_CODE_MAP[status] ?? 'INTERNAL_ERROR',
        };
      }

      if (typeof responseRecord.error === 'string') {
        return {
          message: responseRecord.error,
          code: STATUS_CODE_MAP[status] ?? 'INTERNAL_ERROR',
        };
      }
    }

    return {
      message: fallbackMessage,
      code: STATUS_CODE_MAP[status] ?? 'INTERNAL_ERROR',
    };
  }
}
