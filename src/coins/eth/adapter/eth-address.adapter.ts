import { Injectable } from '@nestjs/common';
import type { WalletCore } from '@trustwallet/wallet-core';
import { resolveEthWalletCoreConfig } from '../eth-wallet-core.config';
import { AdapterError } from '../../../common/errors/adapter-error';
import { WalletCoreAdapter } from '../../../common/wallet-core/wallet-core.adapter';
import { CoinAddressAdapter } from '../../../common/interfaces/coin-address-adapter.interface';
import { EthAddressGenerateAdapterInput } from './dto/eth-address-generate-input.dto';
import { EthAddressGenerateAdapterOutput } from './dto/eth-address-generate-output.dto';
import { EthAddressValidateAdapterInput } from './dto/eth-address-validate-input.dto';
import { EthAddressValidateAdapterOutput } from './dto/eth-address-validate-output.dto';

type AnyAddressInstance = InstanceType<WalletCore['AnyAddress']>;
type DerivationPathInstance = InstanceType<WalletCore['DerivationPath']>;
type HDWalletInstance = InstanceType<WalletCore['HDWallet']>;
type PrivateKeyInstance = InstanceType<WalletCore['PrivateKey']>;
type PublicKeyInstance = InstanceType<WalletCore['PublicKey']>;

/**
 * Adapter for ETH address generation and validation using wallet-core.
 */
@Injectable()
export class EthAddressAdapter implements CoinAddressAdapter<
  EthAddressGenerateAdapterInput,
  EthAddressGenerateAdapterOutput
> {
  constructor(private readonly walletCore: WalletCoreAdapter) {}

  /**
   * Generates an ETH address and keys.
   * @param input Adapter request payload.
   * @returns Generated address response.
   */
  generate(
    input: EthAddressGenerateAdapterInput,
  ): EthAddressGenerateAdapterOutput {
    const passphrase = input.mnemonic.passphrase ?? '';
    const core = this.walletCore.getCore();
    const { coinType, purpose, derivation } = resolveEthWalletCoreConfig(core);
    const slip44 = core.CoinTypeExt.slip44Id(coinType);

    let address: AnyAddressInstance | null = null;
    let derivationPath: DerivationPathInstance | null = null;
    let privateKey: PrivateKeyInstance | null = null;
    let publicKey: PublicKeyInstance | null = null;
    let wallet: HDWalletInstance | null = null;

    try {
      if (!this.walletCore.isMnemonicValid(input.mnemonic.value)) {
        throw new AdapterError(
          'ETH_MNEMONIC_INVALID',
          'ETH mnemonic is invalid',
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
      if (error instanceof AdapterError) {
        throw error;
      }
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'ETH_ADDRESS_GENERATION_FAILED',
        'ETH address generation failed',
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
   * Validates an ETH address.
   * @param input Adapter request payload.
   * @returns Validation response.
   */
  validate(
    input: EthAddressValidateAdapterInput,
  ): EthAddressValidateAdapterOutput {
    try {
      const core = this.walletCore.getCore();
      const { coinType } = resolveEthWalletCoreConfig(core);
      return {
        isValid: core.CoinTypeExt.validate(coinType, input.address),
      };
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'ETH_ADDRESS_VALIDATION_FAILED',
        'ETH address validation failed',
        {
          cause,
        },
      );
    }
  }
}
