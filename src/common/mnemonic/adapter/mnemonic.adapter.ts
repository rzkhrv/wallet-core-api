import { Injectable } from '@nestjs/common';
import { MnemonicGenerateAdapterInput } from './dto/mnemonic-generate-input.dto';
import { MnemonicGenerateAdapterOutput } from './dto/mnemonic-generate-output.dto';
import { MnemonicValidateAdapterInput } from './dto/mnemonic-validate-input.dto';
import { MnemonicValidateAdapterOutput } from './dto/mnemonic-validate-output.dto';
import { WalletCoreAdapter } from '../../wallet-core/wallet-core.adapter';

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
  generate(input: MnemonicGenerateAdapterInput): MnemonicGenerateAdapterOutput {
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
  validate(input: MnemonicValidateAdapterInput): MnemonicValidateAdapterOutput {
    return {
      isValid: this.walletCore.isMnemonicValid(input.mnemonic),
    };
  }
}
