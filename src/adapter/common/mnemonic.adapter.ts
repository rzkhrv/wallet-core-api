import { Injectable } from '@nestjs/common';
import { MnemonicGenerateAdapterRequest } from './dto/mnemonic/mnemonic-generate.dto';
import { MnemonicGenerateAdapterResponse } from './dto/mnemonic/mnemonic-generate-response.dto';
import { MnemonicValidateAdapterRequest } from './dto/mnemonic/mnemonic-validate.dto';
import { MnemonicValidateAdapterResponse } from './dto/mnemonic/mnemonic-validate-response.dto';
import { WalletCoreAdapter } from './wallet-core.adapter';

/**
 * Adapter for mnemonic operations via wallet-core.
 */
@Injectable()
export class MnemonicAdapter {
  constructor(private readonly walletCore: WalletCoreAdapter) {}

  /**
   * Generates a mnemonic phrase.
   * @param input Adapter request payload.
   * @returns Generated mnemonic response.
   */
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

  /**
   * Validates a mnemonic phrase.
   * @param input Adapter request payload.
   * @returns Validation response.
   */
  validate(
    input: MnemonicValidateAdapterRequest,
  ): MnemonicValidateAdapterResponse {
    return {
      isValid: this.walletCore.isMnemonicValid(input.mnemonic),
    };
  }
}
