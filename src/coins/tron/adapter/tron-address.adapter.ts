import { Injectable } from '@nestjs/common';
import { resolveTronWalletCoreConfig } from '../tron-wallet-core.config';
import { AdapterError } from '../../../common/errors/adapter-error';
import { WalletCoreAdapter } from '../../../common/wallet-core/wallet-core.adapter';
import { CoinAddressAdapter } from '../../../common/interfaces/coin-address-adapter.interface';
import type { WalletCore } from '@trustwallet/wallet-core';
import { TronAddressGenerateAdapterInput } from './dto/tron-address-generate-input.dto';
import { TronAddressGenerateAdapterOutput } from './dto/tron-address-generate-output.dto';
import { TronAddressValidateAdapterInput } from './dto/tron-address-validate-input.dto';
import { TronAddressValidateAdapterOutput } from './dto/tron-address-validate-output.dto';

type AnyAddressInstance = InstanceType<WalletCore['AnyAddress']>;
type DerivationPathInstance = InstanceType<WalletCore['DerivationPath']>;
type HDWalletInstance = InstanceType<WalletCore['HDWallet']>;
type PrivateKeyInstance = InstanceType<WalletCore['PrivateKey']>;
type PublicKeyInstance = InstanceType<WalletCore['PublicKey']>;

/**
 * Adapter for TRON address generation and validation using wallet-core.
 */
@Injectable()
export class TronAddressAdapter implements CoinAddressAdapter<
  TronAddressGenerateAdapterInput,
  TronAddressGenerateAdapterOutput
> {
  constructor(private readonly walletCore: WalletCoreAdapter) {}

  /**
   * Generates a TRON address and keys.
   * @param input Adapter request payload.
   * @returns Generated address response.
   */
  generate(
    input: TronAddressGenerateAdapterInput,
  ): TronAddressGenerateAdapterOutput {
    const passphrase = input.mnemonic.passphrase ?? '';
    const core = this.walletCore.getCore();
    const { coinType, purpose } = resolveTronWalletCoreConfig(core);
    const slip44 = core.CoinTypeExt.slip44Id(coinType);

    let address: AnyAddressInstance | null = null;
    let derivationPath: DerivationPathInstance | null = null;
    let privateKey: PrivateKeyInstance | null = null;
    let publicKey: PublicKeyInstance | null = null;
    let wallet: HDWalletInstance | null = null;

    try {
      if (!this.walletCore.isMnemonicValid(input.mnemonic.value)) {
        throw new AdapterError(
          'TRON_MNEMONIC_INVALID',
          'TRON mnemonic is invalid',
        );
      }
      wallet = this.walletCore.createHDWalletWithMnemonic(
        input.mnemonic.value,
        passphrase,
      );
      derivationPath = core.DerivationPath.create(
        purpose,
        slip44,
        input.derivation.account,
        input.derivation.change,
        input.derivation.index,
      );
      const path = derivationPath.description();
      privateKey = wallet.getKey(coinType, path);
      publicKey = privateKey.getPublicKey(coinType);
      address = core.AnyAddress.createWithPublicKey(publicKey, coinType);
      return {
        address: address.description(),
        keys: {
          public: core.HexCoding.encode(publicKey.data()),
          private: core.HexCoding.encode(privateKey.data()),
        },
        derivation: {
          path,
          purpose: purpose.value,
          coin: slip44,
          account: input.derivation.account,
          change: input.derivation.change,
          index: input.derivation.index,
        },
      };
    } catch (error: unknown) {
      if (error instanceof AdapterError) {
        throw error;
      }
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'TRON_ADDRESS_GENERATION_FAILED',
        'TRON address generation failed',
        {
          cause,
        },
      );
    } finally {
      address?.delete();
      publicKey?.delete();
      privateKey?.delete();
      derivationPath?.delete();
      wallet?.delete();
    }
  }

  /**
   * Validates a TRON address.
   * @param input Adapter request payload.
   * @returns Validation response.
   */
  validate(
    input: TronAddressValidateAdapterInput,
  ): TronAddressValidateAdapterOutput {
    try {
      const core = this.walletCore.getCore();
      const { coinType } = resolveTronWalletCoreConfig(core);
      return {
        isValid: core.CoinTypeExt.validate(coinType, input.address),
      };
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'TRON_ADDRESS_VALIDATION_FAILED',
        'TRON address validation failed',
        {
          cause,
        },
      );
    }
  }
}
