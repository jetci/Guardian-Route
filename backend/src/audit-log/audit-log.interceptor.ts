import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from './audit-log.service';
import { Request } from 'express';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AuditLogInterceptor.name);

    constructor(private readonly auditLogService: AuditLogService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const { method, url, body, user, ip } = request as any;

        // Skip GET requests (unless critical) to reduce noise
        if (method === 'GET') {
            return next.handle();
        }

        return next.handle().pipe(
            tap({
                next: async () => {
                    try {
                        if (user) {
                            await this.auditLogService.create({
                                userId: user.id,
                                username: user.username,
                                action: `${method} ${url}`,
                                targetType: 'API',
                                targetId: null,
                                details: {
                                    method,
                                    url,
                                    body: this.sanitizeBody(body),
                                },
                                ipAddress: ip,
                                userAgent: request.headers['user-agent'],
                            });
                        }
                    } catch (error) {
                        this.logger.error('Failed to create audit log', error);
                    }
                },
                error: async (error) => {
                    // Optional: Log failed attempts too
                },
            }),
        );
    }

    private sanitizeBody(body: any) {
        if (!body) return null;
        const sanitized = { ...body };
        // Remove sensitive fields
        const sensitiveFields = ['password', 'token', 'secret'];
        sensitiveFields.forEach((field) => {
            if (field in sanitized) {
                sanitized[field] = '***';
            }
        });
        return sanitized;
    }
}
