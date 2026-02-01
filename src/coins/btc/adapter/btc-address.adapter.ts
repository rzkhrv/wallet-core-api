import { Injectable } from '@nestjs/common';
import { resolveBtcWalletCoreConfig } from '../btc-wallet-core.config';
import { AdapterError } from '../../../common/errors/adapter-error';
import { WalletCoreAdapter } from '../../../common/wallet-core/wallet-core.adapter';
import { BtcAddressGenerateAdapterInput } from './dto/btc-address-generate-input.dto';
import { BtcAddressGenerateAdapterOutput } from './dto/btc-address-generate-output.dto';
import { BtcAddressValidateAdapterInput } from './dto/btc-address-validate-input.dto';
import { BtcAddressValidateAdapterOutput } from './dto/btc-address-validate-output.dto';
import { CoinAddressAdapter } from '../../../common/interfaces/coin-address-adapter.interface';
import type { WalletCore } from '@trustwallet/wallet-core';

type AnyAddressInstance = InstanceType<WalletCore['AnyAddress']>;
type DerivationPathInstance = InstanceType<WalletCore['DerivationPath']>;
type PrivateKeyInstance = InstanceType<WalletCore['PrivateKey']>;
type PublicKeyInstance = InstanceType<WalletCore['PublicKey']>;

/**
 * Adapter for BTC address generation and validation using wallet-core.
 */
@Injectable()
export class BtcAddressAdapter implements CoinAddressAdapter<
  BtcAddressGenerateAdapterInput,
  BtcAddressGenerateAdapterOutput
> {
  constructor(private readonly walletCore: WalletCoreAdapter) {}

  /**
   * Generates a BTC address and keys.
   * @param input Adapter request payload.
   * @returns Generated address response.
   */
  generate(
    input: BtcAddressGenerateAdapterInput,
  ): BtcAddressGenerateAdapterOutput {
    const passphrase = input.mnemonic.passphrase ?? '';
    const core = this.walletCore.getCore();
    const { coinType, purpose, derivation } = resolveBtcWalletCoreConfig(core);
    const slip44 = core.CoinTypeExt.slip44Id(coinType);

    let address: AnyAddressInstance | null = null;
    let derivationPath: DerivationPathInstance | null = null;
    let privateKey: PrivateKeyInstance | null = null;
    let publicKey: PublicKeyInstance | null = null;

    const wallet = this.walletCore.createHDWalletWithMnemonic(
      input.mnemonic.value,
      passphrase,
    );

    try {
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

      address = core.AnyAddress.createWithPublicKeyDerivation(
        publicKey,
        coinType,
        derivation,
      );

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
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'BTC_ADDRESS_GENERATION_FAILED',
        'BTC address generation failed',
        {
          cause,
        },
      );
    } finally {
      address?.delete();
      publicKey?.delete();
      privateKey?.delete();
      derivationPath?.delete();
      wallet.delete();
    }
  }

  /**
   * Validates a BTC address.
   * @param input Adapter request payload.
   * @returns Validation response.
   */
  validate(
    input: BtcAddressValidateAdapterInput,
  ): BtcAddressValidateAdapterOutput {
    try {
      const core = this.walletCore.getCore();
      const { coinType } = resolveBtcWalletCoreConfig(core);
      return {
        isValid: core.CoinTypeExt.validate(coinType, input.address),
      };
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'BTC_ADDRESS_VALIDATION_FAILED',
        'BTC address validation failed',
        {
          cause,
        },
      );
    }
  }
}
