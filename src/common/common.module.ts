import { Module } from '@nestjs/common';
import { MnemonicModule } from './mnemonic/mnemonic.module';

/**
 * Common shared module for cross-domain features.
 */
@Module({
  imports: [MnemonicModule],
  exports: [MnemonicModule],
})
export class CommonModule {}
