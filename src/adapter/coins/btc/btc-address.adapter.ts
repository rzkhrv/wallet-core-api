import { Injectable } from '@nestjs/common';
import { Coin } from '../../../coins/enum/coin.enum';
import { resolveCoinConfig } from '../../../coins/coin.config';
import { AdapterError } from '../../common/adapter-error';
import { WalletCoreAdapter } from '../../common/wallet-core.adapter';
import {
  BtcAddressGenerateAdapterRequest,
  BtcAddressGenerateAdapterResponse,
} from './dto/btc-address-generate.dto';
import {
  BtcAddressValidateAdapterRequest,
  BtcAddressValidateAdapterResponse,
} from './dto/btc-address-validate.dto';
import { CoinAddressAdapter } from '../coin-adapter.contracts';
import type { WalletCore } from '@trustwallet/wallet-core';

type AnyAddressInstance = InstanceType<WalletCore['AnyAddress']>;
type DerivationPathInstance = InstanceType<WalletCore['DerivationPath']>;
type PrivateKeyInstance = InstanceType<WalletCore['PrivateKey']>;
type PublicKeyInstance = InstanceType<WalletCore['PublicKey']>;

@Injectable()
export class BtcAddressAdapter implements CoinAddressAdapter<
  BtcAddressGenerateAdapterRequest,
  BtcAddressGenerateAdapterResponse
> {
  constructor(private readonly walletCore: WalletCoreAdapter) {}

  generate(
    input: BtcAddressGenerateAdapterRequest,
  ): BtcAddressGenerateAdapterResponse {
    const passphrase = input.mnemonic.passphrase ?? '';
    const core = this.walletCore.getCore();
    const { coinType, purpose, derivation } = resolveCoinConfig(core, Coin.BTC);
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
    } catch (error) {
      throw new AdapterError(
        'BTC_ADDRESS_GENERATION_FAILED',
        'BTC address generation failed',
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

  validate(
    input: BtcAddressValidateAdapterRequest,
  ): BtcAddressValidateAdapterResponse {
    try {
      const core = this.walletCore.getCore();
      const { coinType } = resolveCoinConfig(core, Coin.BTC);
      return {
        isValid: core.CoinTypeExt.validate(coinType, input.address),
      };
    } catch (error) {
      throw new AdapterError(
        'BTC_ADDRESS_VALIDATION_FAILED',
        'BTC address validation failed',
        {
          cause: error instanceof Error ? error.message : error,
        },
      );
    }
  }
}
