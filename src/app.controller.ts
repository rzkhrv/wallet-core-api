import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { HealthStatus } from './app-health-status';

/**
 * Handles application-level health endpoints.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Returns the health status for the service.
   * @returns Current health status payload.
   */
  @Get()
  getHealth(): HealthStatus {
    return this.appService.getHealth();
  }
}
