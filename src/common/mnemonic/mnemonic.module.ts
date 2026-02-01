import { Module } from '@nestjs/common';
import { AdapterModule } from '../../adapter/adapter.module';
import { MnemonicController } from './mnemonic.controller';
import { MnemonicService } from './mnemonic.service';

/**
 * Module for mnemonic-related endpoints and services.
 */
@Module({
  imports: [AdapterModule],
  controllers: [MnemonicController],
  providers: [MnemonicService],
  exports: [MnemonicService],
})
export class MnemonicModule {}
