import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { ApiFailure, ApiError } from "@bola/contracts/api";
import { Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception);

    const response = host.switchToHttp().getResponse<Response>();

    let status = 500;
    let error: ApiError = {
      code: "common.internal_error",
      message: "Something went wrong",
    };

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      status = exception.getStatus();

      if (typeof payload === "string") {
        error = {
          code: "common.unknown_error",
          message: payload,
        };
      } else {
        const typedPayload = payload as Partial<ApiError>;
        error = {
          code: typedPayload.code ?? "common.unknown_error",
          message: typedPayload.message ?? exception.message.slice(0, -10),
          details: typedPayload.details,
        };
      }
    }

    response.status(status).json({
      success: false,
      error,
    } satisfies ApiFailure);
  }
}
