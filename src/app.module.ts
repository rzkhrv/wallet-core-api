import { Module } from '@nestjs/common';
import { CoinsModule } from './coins/coins.module';
import { CommonModule } from './common/common.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Root application module.
 */
@Module({
  imports: [CoinsModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
