import { Module } from '@nestjs/common';
import { AdapterModule } from './adapter/adapter.module';
import { CoinsModule } from './coins/coins.module';
import { CommonModule } from './common/common.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AdapterModule, CoinsModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
