import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { HealthStatus } from './app-health-status';

type AdminTestResponse = {
  status: 'ok';
};

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

  /**
   * Returns a simple admin smoke test response.
   * @returns Admin test response.
   */
  @Get('admin/test')
  adminTest(): AdminTestResponse {
    return { status: 'ok' };
  }
}
