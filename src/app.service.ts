import { Injectable } from '@nestjs/common';
import type { HealthStatus } from './app-health-status';

/**
 * Provides application health information.
 */
@Injectable()
export class AppService {
  /**
   * Builds a health status response.
   * @returns Current health status payload.
   */
  getHealth(): HealthStatus {
    return {
      status: 'ok',
      service: 'wallet-core-api',
      timestamp: new Date().toISOString(),
    };
  }
}
