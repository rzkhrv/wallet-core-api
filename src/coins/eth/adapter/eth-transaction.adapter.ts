import { Injectable, Logger } from '@nestjs/common';
import { TW } from '@trustwallet/wallet-core';
import { resolveEthWalletCoreConfig } from '../eth-wallet-core.config';
import { AdapterError } from '../../../common/errors/adapter-error';
import { WalletCoreAdapter } from '../../../common/wallet-core/wallet-core.adapter';
import { CoinTransactionAdapter } from '../../../common/interfaces/coin-transaction-adapter.interface';
import { EthErc20TransferBuildAdapterInput } from './dto/eth-erc20-transfer-build-input.dto';
import {
  EthErc20TransferBuildAdapterOutput,
  EthErc20TransferIntent,
} from './dto/eth-erc20-transfer-build-output.dto';
import { EthTransactionBuildAdapterInput } from './dto/eth-transaction-build-input.dto';
import {
  EthTransactionBuildAdapterOutput,
  EthTransactionIntent,
} from './dto/eth-transaction-build-output.dto';
import { EthTransactionSignAdapterInput } from './dto/eth-transaction-sign-input.dto';
import { EthTransactionSignAdapterOutput } from './dto/eth-transaction-sign-output.dto';

/**
 * Adapter for ETH transaction build and signing using wallet-core.
 */
@Injectable()
export class EthTransactionAdapter implements CoinTransactionAdapter<
  EthTransactionBuildAdapterInput,
  EthTransactionBuildAdapterOutput,
  EthErc20TransferBuildAdapterInput,
  EthErc20TransferBuildAdapterOutput
> {
  private readonly logger = new Logger(EthTransactionAdapter.name);

  constructor(private readonly walletCore: WalletCoreAdapter) {}

  /**
   * Builds an ETH transaction payload.
   * @param input Adapter request payload.
   * @returns Build response with payload.
   */
  buildTransaction(
    input: EthTransactionBuildAdapterInput,
  ): EthTransactionBuildAdapterOutput {
    this.logger.log(`Building ETH transaction (to=${input.toAddress})`);

    try {
      const signingInput = this.createTransferSigningInput(input);
      return {
        payload: this.encodeSigningInput(signingInput),
        transaction: this.resolveTransferIntent(signingInput),
      };
    } catch (error: unknown) {
      if (error instanceof AdapterError) {
        throw error;
      }
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'ETH_TRANSACTION_BUILD_FAILED',
        'ETH transaction build failed',
        {
          cause,
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
    input: EthErc20TransferBuildAdapterInput,
  ): EthErc20TransferBuildAdapterOutput {
    this.logger.log(`Building ETH ERC20 transfer (to=${input.toAddress})`);

    try {
      const signingInput = this.createErc20SigningInput(input);
      return {
        payload: this.encodeSigningInput(signingInput),
        transaction: this.resolveErc20TransferIntent(signingInput),
      };
    } catch (error: unknown) {
      if (error instanceof AdapterError) {
        throw error;
      }
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'ETH_ERC20_BUILD_FAILED',
        'ETH ERC20 transfer build failed',
        {
          cause,
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
    input: EthTransactionSignAdapterInput,
  ): EthTransactionSignAdapterOutput {
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

  private createTransferSigningInput(
    input: EthTransactionBuildAdapterInput,
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
    input: EthErc20TransferBuildAdapterInput,
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

  private encodeSigningInput(
    signingInput: TW.Ethereum.Proto.SigningInput,
  ): string {
    const core = this.walletCore.getCore();
    const inputBytes =
      TW.Ethereum.Proto.SigningInput.encode(signingInput).finish();
    return core.HexCoding.encode(inputBytes);
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
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(errorCode, errorMessage, { cause });
    }
  }

  private signSigningInput(
    signingInput: TW.Ethereum.Proto.SigningInput,
    privateKey: string,
    errorCode: string,
    errorMessage: string,
  ): EthTransactionSignAdapterOutput {
    const core = this.walletCore.getCore();
    const { coinType } = resolveEthWalletCoreConfig(core);

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
    } catch (error: unknown) {
      if (error instanceof AdapterError) {
        throw error;
      }
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(errorCode, errorMessage, { cause });
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

  private resolveTransferIntent(
    signingInput: TW.Ethereum.Proto.SigningInput,
  ): EthTransactionIntent {
    const transaction = signingInput.transaction?.transfer;
    if (!transaction) {
      throw new AdapterError(
        'ETH_TRANSACTION_BUILD_INCOMPLETE',
        'ETH transfer payload missing transfer data',
      );
    }

    return {
      chainId: this.bytesToDecimal(
        this.requireBytes(signingInput.chainId, 'chainId'),
      ),
      nonce: this.bytesToDecimal(
        this.requireBytes(signingInput.nonce, 'nonce'),
      ),
      gasPrice: this.bytesToDecimal(
        this.requireBytes(signingInput.gasPrice, 'gasPrice'),
      ),
      gasLimit: this.bytesToDecimal(
        this.requireBytes(signingInput.gasLimit, 'gasLimit'),
      ),
      toAddress: this.requireString(signingInput.toAddress, 'toAddress'),
      amount: this.bytesToDecimal(
        this.requireBytes(transaction.amount, 'amount'),
      ),
    };
  }

  private resolveErc20TransferIntent(
    signingInput: TW.Ethereum.Proto.SigningInput,
  ): EthErc20TransferIntent {
    const transaction = signingInput.transaction?.erc20Transfer;
    if (!transaction) {
      throw new AdapterError(
        'ETH_ERC20_BUILD_INCOMPLETE',
        'ETH ERC20 payload missing transfer data',
      );
    }

    return {
      chainId: this.bytesToDecimal(
        this.requireBytes(signingInput.chainId, 'chainId'),
      ),
      nonce: this.bytesToDecimal(
        this.requireBytes(signingInput.nonce, 'nonce'),
      ),
      gasPrice: this.bytesToDecimal(
        this.requireBytes(signingInput.gasPrice, 'gasPrice'),
      ),
      gasLimit: this.bytesToDecimal(
        this.requireBytes(signingInput.gasLimit, 'gasLimit'),
      ),
      toAddress: this.requireString(transaction.to, 'toAddress'),
      tokenContract: this.requireString(
        signingInput.toAddress,
        'tokenContract',
      ),
      amount: this.bytesToDecimal(
        this.requireBytes(transaction.amount, 'amount'),
      ),
    };
  }

  private bytesToDecimal(value: Uint8Array): string {
    if (value.length === 0) {
      return '0';
    }
    const hex = this.walletCore.getCore().HexCoding.encode(value);
    const normalized = this.normalizeHex(hex);
    const safeHex = normalized.length === 0 ? '0' : normalized;
    return BigInt(`0x${safeHex}`).toString(10);
  }

  private requireBytes(
    value: Uint8Array | null | undefined,
    field: string,
  ): Uint8Array {
    if (!value) {
      throw new AdapterError(
        'ETH_TRANSACTION_BUILD_INCOMPLETE',
        `ETH payload missing ${field}`,
        { field },
      );
    }
    return value;
  }

  private requireString(
    value: string | null | undefined,
    field: string,
  ): string {
    if (!value) {
      throw new AdapterError(
        'ETH_TRANSACTION_BUILD_INCOMPLETE',
        `ETH payload missing ${field}`,
        { field },
      );
    }
    return value;
  }
}
