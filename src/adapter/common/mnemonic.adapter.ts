import { Injectable } from '@nestjs/common';
import {
  MnemonicGenerateAdapterRequest,
  MnemonicGenerateAdapterResponse,
} from './dto/mnemonic/mnemonic-generate.dto';
import {
  MnemonicValidateAdapterRequest,
  MnemonicValidateAdapterResponse,
} from './dto/mnemonic/mnemonic-validate.dto';
import { WalletCoreAdapter } from './wallet-core.adapter';

@Injectable()
export class MnemonicAdapter {
  constructor(private readonly walletCore: WalletCoreAdapter) {}

  generate(
    input: MnemonicGenerateAdapterRequest,
  ): MnemonicGenerateAdapterResponse {
    const passphrase = input.passphrase ?? '';
    const wallet = this.walletCore.createHDWallet(input.strength, passphrase);
    try {
      const mnemonic = wallet.mnemonic();
      return {
        mnemonic,
        isPassphraseUsed: passphrase.length > 0,
        strengthBits: input.strength,
      };
    } finally {
      wallet.delete();
    }
  }

  validate(
    input: MnemonicValidateAdapterRequest,
  ): MnemonicValidateAdapterResponse {
    return {
      isValid: this.walletCore.isMnemonicValid(input.mnemonic),
    };
  }
}
