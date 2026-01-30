import { Module } from '@nestjs/common';
import { MnemonicModule } from './mnemonic/mnemonic.module';

@Module({
  imports: [MnemonicModule],
  exports: [MnemonicModule],
})
export class CommonModule {}
