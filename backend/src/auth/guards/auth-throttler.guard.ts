import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AuthThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    // Track by IP address
    return Promise.resolve(
      req.ip || req.connection.remoteAddress || 'unknown',
    );
  }
}
