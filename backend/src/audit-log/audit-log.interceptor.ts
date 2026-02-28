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
                            const safeUsername =
                                (typeof (user as any).username === 'string' && (user as any).username.trim())
                                    ? (user as any).username
                                    : (typeof (user as any).email === 'string' && (user as any).email.trim())
                                        ? (user as any).email
                                        : (typeof (user as any).id === 'string' && (user as any).id.trim())
                                            ? (user as any).id
                                            : undefined;

                            if (!safeUsername) {
                                this.logger.warn('Skipping audit log: missing username/email on user');
                                return;
                            }

                            const bodySanitized = this.sanitizeBody(body);
                            const details: any = { method, url };
                            if (bodySanitized != null) {
                                details.body = bodySanitized;
                            }

                            await this.auditLogService.create({
                                userId: (user as any).id,
                                username: safeUsername,
                                action: `${method} ${url}`,
                                targetType: 'API',
                                targetId: undefined,
                                details,
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
