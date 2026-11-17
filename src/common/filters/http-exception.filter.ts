import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";

import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = "Internal server error";

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();

            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === "string") {
                message = exceptionResponse;
            } else if (
                typeof exceptionResponse === "object" &&
                exceptionResponse !== null &&
                "message" in exceptionResponse
            ) {
                message = (
                    exceptionResponse as {
                        message: string | string[];
                    }
                ).message;
            }
        } else {
            this.logger.error(
                exception instanceof Error
                    ? exception.stack
                    : String(exception),
            );
        }

        response.status(statusCode).json({
            success: false,
            statusCode,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}