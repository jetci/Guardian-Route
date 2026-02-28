import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
    ConflictException,
    Optional,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

/**
 * Idempotency Interceptor
 * Prevents duplicate POST requests by caching responses based on idempotency key
 * 
 * Usage:
 * @UseInterceptors(IdempotencyInterceptor)
 * @Post()
 * async create(@Headers('idempotency-key') key: string, @Body() dto) { ... }
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
    constructor(@Optional() @Inject(CACHE_MANAGER) private cacheManager?: Cache) { }

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;

        // Only apply to POST, PUT, PATCH requests
        if (!['POST', 'PUT', 'PATCH'].includes(method)) {
            return next.handle();
        }

        const idempotencyKey = request.headers['idempotency-key'];

        // Skip if no idempotency key provided
        if (!idempotencyKey) {
            return next.handle();
        }

        // Validate idempotency key format (should be UUID or similar)
        if (!this.isValidIdempotencyKey(idempotencyKey)) {
            throw new ConflictException('Invalid idempotency key format');
        }

        // Create cache key with user ID and endpoint
        const userId = request.user?.id || 'anonymous';
        const endpoint = `${method}:${request.url}`;
        const cacheKey = `idempotency:${userId}:${endpoint}:${idempotencyKey}`;

        // Check if request with this key already exists
        if (this.cacheManager) {
            const cachedResponse = await this.cacheManager.get(cacheKey);
            if (cachedResponse) {
                // Return cached response (idempotent behavior)
                console.log(`[Idempotency] Returning cached response for key: ${idempotencyKey}`);
                return of(cachedResponse);
            }
        }

        // Process request and cache the result
        return next.handle().pipe(
                                tap(async (response) => {
                                if (!this.cacheManager) return;
                                try {
                                    // Cache response for 24 hours (86400 seconds)
                                    await this.cacheManager.set(cacheKey, response, 86400);
                                    console.log(`[Idempotency] Cached response for key: ${idempotencyKey}`);
                                } catch (err) {
                                    console.warn('[Idempotency] Failed to cache response:', err?.message || err);
                                }
                        }),
        );
    }

    /**
     * Validate idempotency key format
     * Should be UUID v4 or similar unique identifier
     */
    private isValidIdempotencyKey(key: string): boolean {
        // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        // Also accept simple alphanumeric strings (min 16 chars)
        const simpleRegex = /^[a-zA-Z0-9_-]{16,}$/;

        return uuidRegex.test(key) || simpleRegex.test(key);
    }
}
