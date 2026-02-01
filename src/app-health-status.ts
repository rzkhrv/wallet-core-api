/**
 * Describes the application health status payload.
 */
export interface HealthStatus {
  status: 'ok';
  service: string;
  timestamp: string;
}
