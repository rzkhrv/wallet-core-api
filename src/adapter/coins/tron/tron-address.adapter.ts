import { Injectable } from '@nestjs/common';
import { resolveCoinConfig } from '../../../coins/coin.config';
import { Coin } from '../../../coins/enum/coin.enum';
import { AdapterError } from '../../common/adapter-error';
import { WalletCoreAdapter } from '../../common/wallet-core.adapter';
import { CoinAddressAdapter } from '../coin-adapter.contracts';
import type { WalletCore } from '@trustwallet/wallet-core';
import { TronAddressGenerateAdapterRequest } from './dto/tron-address-generate.dto';
import { TronAddressGenerateAdapterResponse } from './dto/tron-address-generate-response.dto';
import { TronAddressValidateAdapterRequest } from './dto/tron-address-validate.dto';
import { TronAddressValidateAdapterResponse } from './dto/tron-address-validate-response.dto';

type AnyAddressInstance = InstanceType<WalletCore['AnyAddress']>;
type DerivationPathInstance = InstanceType<WalletCore['DerivationPath']>;
type PrivateKeyInstance = InstanceType<WalletCore['PrivateKey']>;
type PublicKeyInstance = InstanceType<WalletCore['PublicKey']>;

/**
 * Adapter for TRON address generation and validation using wallet-core.
 */
@Injectable()
export class TronAddressAdapter implements CoinAddressAdapter<
  TronAddressGenerateAdapterRequest,
  TronAddressGenerateAdapterResponse
> {
  constructor(private readonly walletCore: WalletCoreAdapter) {}

  /**
   * Generates a TRON address and keys.
   * @param input Adapter request payload.
   * @returns Generated address response.
   */
  generate(
    input: TronAddressGenerateAdapterRequest,
  ): TronAddressGenerateAdapterResponse {
    const passphrase = input.mnemonic.passphrase ?? '';
    const core = this.walletCore.getCore();
    const { coinType, purpose } = resolveCoinConfig(core, Coin.TRON);
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
    } catch (error) {
      throw new AdapterError(
        'TRON_ADDRESS_GENERATION_FAILED',
        'TRON address generation failed',
        {
          cause: error instanceof Error ? error.message : error,
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
   * Validates a TRON address.
   * @param input Adapter request payload.
   * @returns Validation response.
   */
  validate(
    input: TronAddressValidateAdapterRequest,
  ): TronAddressValidateAdapterResponse {
    try {
      const core = this.walletCore.getCore();
      const { coinType } = resolveCoinConfig(core, Coin.TRON);
      return {
        isValid: core.CoinTypeExt.validate(coinType, input.address),
      };
    } catch (error) {
      throw new AdapterError(
        'TRON_ADDRESS_VALIDATION_FAILED',
        'TRON address validation failed',
        {
          cause: error instanceof Error ? error.message : error,
        },
      );
    }
  }
}
