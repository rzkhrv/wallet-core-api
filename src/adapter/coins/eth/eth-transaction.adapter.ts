import { Injectable, Logger } from '@nestjs/common';
import { TW } from '@trustwallet/wallet-core';
import { resolveCoinConfig } from '../../../coins/coin.config';
import { Coin } from '../../../coins/enum/coin.enum';
import { AdapterError } from '../../common/adapter-error';
import { WalletCoreAdapter } from '../../common/wallet-core.adapter';
import { CoinTransactionAdapter } from '../coin-adapter.contracts';
import { EthErc20TransferBuildAdapterRequest } from './dto/eth-erc20-transfer.dto';
import { EthErc20TransferBuildAdapterResponse } from './dto/eth-erc20-transfer-response.dto';
import { EthErc20TransferSignAdapterRequest } from './dto/eth-erc20-transfer-sign.dto';
import { EthErc20TransferSignAdapterResponse } from './dto/eth-erc20-transfer-sign-response.dto';
import { EthTransactionBuildAdapterRequest } from './dto/eth-transaction-build.dto';
import { EthTransactionBuildAdapterResponse } from './dto/eth-transaction-build-response.dto';
import { EthTransactionSignAdapterRequest } from './dto/eth-transaction-sign.dto';
import { EthTransactionSignAdapterResponse } from './dto/eth-transaction-sign-response.dto';

/**
 * Adapter for ETH transaction build and signing using wallet-core.
 */
@Injectable()
export class EthTransactionAdapter implements CoinTransactionAdapter<
  EthTransactionBuildAdapterRequest,
  EthTransactionBuildAdapterResponse,
  EthErc20TransferBuildAdapterRequest,
  EthErc20TransferBuildAdapterResponse
> {
  private readonly logger = new Logger(EthTransactionAdapter.name);

  constructor(private readonly walletCore: WalletCoreAdapter) {}

  /**
   * Builds an ETH transaction payload.
   * @param input Adapter request payload.
   * @returns Build response with payload.
   */
  buildTransaction(
    input: EthTransactionBuildAdapterRequest,
  ): EthTransactionBuildAdapterResponse {
    this.logger.log(`Building ETH transaction (to=${input.toAddress})`);

    try {
      const signingInput = this.createTransferSigningInput(input);
      return this.encodeSigningInput(signingInput);
    } catch (error) {
      if (error instanceof AdapterError) {
        throw error;
      }
      throw new AdapterError(
        'ETH_TRANSACTION_BUILD_FAILED',
        'ETH transaction build failed',
        {
          cause: error instanceof Error ? error.message : error,
        },
      );
    }
  }

  /**
   * Builds an ERC20 transfer payload.
   * @param input Adapter request payload.
   * @returns Build response with payload.
   */
  buildTransfer(
    input: EthErc20TransferBuildAdapterRequest,
  ): EthErc20TransferBuildAdapterResponse {
    this.logger.log(`Building ETH ERC20 transfer (to=${input.toAddress})`);

    try {
      const signingInput = this.createErc20SigningInput(input);
      return this.encodeSigningInput(signingInput);
    } catch (error) {
      if (error instanceof AdapterError) {
        throw error;
      }
      throw new AdapterError(
        'ETH_ERC20_BUILD_FAILED',
        'ETH ERC20 transfer build failed',
        {
          cause: error instanceof Error ? error.message : error,
        },
      );
    }
  }

  /**
   * Signs an ETH transaction payload.
   * @param input Adapter request payload.
   * @returns Signed transaction response.
   */
  signTransaction(
    input: EthTransactionSignAdapterRequest,
  ): EthTransactionSignAdapterResponse {
    this.logger.log('Signing ETH transaction');
    const signingInput = this.decodeSigningInput(
      input.payload,
      'ETH_SIGNING_INPUT_INVALID',
      'ETH transaction signing payload invalid',
    );
    return this.signSigningInput(
      signingInput,
      input.privateKey,
      'ETH_SIGNING_FAILED',
      'ETH signing failed',
    );
  }

  /**
   * Signs an ERC20 transfer payload.
   * @param input Adapter request payload.
   * @returns Signed transfer response.
   */
  signTransfer(
    input: EthErc20TransferSignAdapterRequest,
  ): EthErc20TransferSignAdapterResponse {
    this.logger.log('Signing ETH ERC20 transfer');
    const signingInput = this.decodeSigningInput(
      input.payload,
      'ETH_ERC20_SIGNING_INPUT_INVALID',
      'ETH ERC20 signing payload invalid',
    );
    return this.signSigningInput(
      signingInput,
      input.privateKey,
      'ETH_ERC20_SIGNING_FAILED',
      'ETH ERC20 signing failed',
    );
  }

  private createTransferSigningInput(
    input: EthTransactionBuildAdapterRequest,
  ): TW.Ethereum.Proto.SigningInput {
    return TW.Ethereum.Proto.SigningInput.create({
      chainId: this.toBytes(input.chainId),
      nonce: this.toBytes(input.nonce),
      gasPrice: this.toBytes(input.gasPrice),
      gasLimit: this.toBytes(input.gasLimit),
      toAddress: input.toAddress,
      txMode: TW.Ethereum.Proto.TransactionMode.Legacy,
      transaction: TW.Ethereum.Proto.Transaction.create({
        transfer: {
          amount: this.toBytes(input.amount),
        },
      }),
    });
  }

  private createErc20SigningInput(
    input: EthErc20TransferBuildAdapterRequest,
  ): TW.Ethereum.Proto.SigningInput {
    return TW.Ethereum.Proto.SigningInput.create({
      chainId: this.toBytes(input.chainId),
      nonce: this.toBytes(input.nonce),
      gasPrice: this.toBytes(input.gasPrice),
      gasLimit: this.toBytes(input.gasLimit),
      toAddress: input.tokenContract,
      txMode: TW.Ethereum.Proto.TransactionMode.Legacy,
      transaction: TW.Ethereum.Proto.Transaction.create({
        erc20Transfer: {
          to: input.toAddress,
          amount: this.toBytes(input.amount),
        },
      }),
    });
  }

  private encodeSigningInput(signingInput: TW.Ethereum.Proto.SigningInput): {
    payload: string;
  } {
    const core = this.walletCore.getCore();
    const inputBytes =
      TW.Ethereum.Proto.SigningInput.encode(signingInput).finish();
    return {
      payload: core.HexCoding.encode(inputBytes),
    };
  }

  private decodeSigningInput(
    payload: string,
    errorCode: string,
    errorMessage: string,
  ): TW.Ethereum.Proto.SigningInput {
    const core = this.walletCore.getCore();
    try {
      const normalized = this.normalizeHexBytes(payload);
      const payloadBytes = core.HexCoding.decode(normalized);
      return TW.Ethereum.Proto.SigningInput.decode(payloadBytes);
    } catch (error) {
      throw new AdapterError(errorCode, errorMessage, {
        cause: error instanceof Error ? error.message : error,
      });
    }
  }

  private signSigningInput(
    signingInput: TW.Ethereum.Proto.SigningInput,
    privateKey: string,
    errorCode: string,
    errorMessage: string,
  ): EthTransactionSignAdapterResponse {
    const core = this.walletCore.getCore();
    const { coinType } = resolveCoinConfig(core, Coin.ETH);

    try {
      signingInput.privateKey = core.HexCoding.decode(
        this.normalizeHexBytes(privateKey),
      );

      const inputBytes =
        TW.Ethereum.Proto.SigningInput.encode(signingInput).finish();
      const signedBytes = core.AnySigner.sign(inputBytes, coinType);
      const output = TW.Ethereum.Proto.SigningOutput.decode(signedBytes);

      if (output.error !== TW.Common.Proto.SigningError.OK) {
        throw new AdapterError(errorCode, output.errorMessage || errorMessage, {
          error: output.error,
          errorMessage: output.errorMessage,
        });
      }

      return {
        rawTx: core.HexCoding.encode(output.encoded),
        preHash: core.HexCoding.encode(output.preHash),
        data: core.HexCoding.encode(output.data),
        signature: {
          v: core.HexCoding.encode(output.v),
          r: core.HexCoding.encode(output.r),
          s: core.HexCoding.encode(output.s),
        },
      };
    } catch (error) {
      if (error instanceof AdapterError) {
        throw error;
      }
      throw new AdapterError(errorCode, errorMessage, {
        cause: error instanceof Error ? error.message : error,
      });
    }
  }

  private toBytes(value: string): Uint8Array {
    const normalized = this.normalizeNumeric(value);
    if (normalized.length === 0) {
      return new Uint8Array([0]);
    }
    const even = normalized.length % 2 === 0 ? normalized : `0${normalized}`;
    return this.walletCore.getCore().HexCoding.decode(even);
  }

  private normalizeNumeric(value: string): string {
    if (value.startsWith('0x') || value.startsWith('0X')) {
      return value.slice(2);
    }
    const asBigInt = BigInt(value);
    return asBigInt.toString(16);
  }

  private normalizeHex(value: string): string {
    if (value.startsWith('0x') || value.startsWith('0X')) {
      return value.slice(2);
    }
    return value;
  }

  private normalizeHexBytes(value: string): string {
    const normalized = this.normalizeHex(value);
    if (normalized.length === 0) {
      return normalized;
    }
    return normalized.length % 2 === 0 ? normalized : `0${normalized}`;
  }
}
