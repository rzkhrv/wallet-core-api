import { Injectable, Logger } from '@nestjs/common';
import { TW } from '@trustwallet/wallet-core';
import Long from 'long';
import { resolveTronWalletCoreConfig } from '../tron-wallet-core.config';
import { AdapterError } from '../../../common/errors/adapter-error';
import { WalletCoreAdapter } from '../../../common/wallet-core/wallet-core.adapter';
import { CoinTransactionAdapter } from '../../../common/interfaces/coin-transaction-adapter.interface';
import { TronTransactionBuildAdapterInput } from './dto/tron-transaction-build-input.dto';
import {
  TronTransactionBuildAdapterOutput,
  TronTransactionIntent,
} from './dto/tron-transaction-build-output.dto';
import { TronTransferBuildAdapterInput } from './dto/tron-transfer-build-input.dto';
import { TronTransactionSignAdapterInput } from './dto/tron-transaction-sign-input.dto';
import { TronTransactionSignAdapterOutput } from './dto/tron-transaction-sign-output.dto';

/**
 * Adapter for TRON transaction build and signing using wallet-core.
 */
@Injectable()
export class TronTransactionAdapter implements CoinTransactionAdapter<
  TronTransactionBuildAdapterInput,
  TronTransactionBuildAdapterOutput,
  TronTransferBuildAdapterInput,
  TronTransactionBuildAdapterOutput
> {
  private readonly logger = new Logger(TronTransactionAdapter.name);

  constructor(private readonly walletCore: WalletCoreAdapter) {}

  /**
   * Builds a TRON transfer payload.
   * @param input Adapter request payload.
   * @returns Unsigned transaction response.
   */
  buildTransfer(
    input: TronTransferBuildAdapterInput,
  ): TronTransactionBuildAdapterOutput {
    this.logger.log('Building TRON token transfer');

    try {
      this.ensureZeroCallValue(input.callValue);
      const baseTransaction = this.createBaseTransaction(input);
      const transferTrc20Contract = TW.Tron.Proto.TransferTRC20Contract.create({
        ownerAddress: input.ownerAddress,
        toAddress: input.toAddress,
        contractAddress: input.contractAddress,
        amount: this.toAmountBytes(input.amount),
      });
      const transaction = TW.Tron.Proto.Transaction.create({
        ...baseTransaction,
        transferTrc20Contract,
      });
      const signingInput = this.createSigningInput(transaction);
      return {
        payload: this.encodeSigningInput(signingInput),
        transaction: this.resolveTransactionIntent(transaction),
      };
    } catch (error: unknown) {
      if (error instanceof AdapterError) {
        throw error;
      }
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'TRON_TRC20_BUILD_FAILED',
        'TRON TRC20 transfer build failed',
        {
          cause,
        },
      );
    }
  }

  /**
   * Builds a TRON transaction payload.
   * @param input Adapter request payload.
   * @returns Unsigned transaction response.
   */
  buildTransaction(
    input: TronTransactionBuildAdapterInput,
  ): TronTransactionBuildAdapterOutput {
    this.logger.log('Building TRON TRX transaction');

    try {
      const baseTransaction = this.createBaseTransaction(input);
      const transfer = TW.Tron.Proto.TransferContract.create({
        ownerAddress: input.ownerAddress,
        toAddress: input.toAddress,
        amount: this.toLong(input.amount),
      });
      const transaction = TW.Tron.Proto.Transaction.create({
        ...baseTransaction,
        transfer,
      });
      const signingInput = this.createSigningInput(transaction);
      return {
        payload: this.encodeSigningInput(signingInput),
        transaction: this.resolveTransactionIntent(transaction),
      };
    } catch (error: unknown) {
      if (error instanceof AdapterError) {
        throw error;
      }
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'TRON_TRANSACTION_BUILD_FAILED',
        'TRON transaction build failed',
        {
          cause,
        },
      );
    }
  }

  /**
   * Signs a TRON transaction payload.
   * @param input Adapter request payload.
   * @returns Signed transaction response.
   */
  signTransaction(
    input: TronTransactionSignAdapterInput,
  ): TronTransactionSignAdapterOutput {
    this.logger.log('Signing TRON transaction');
    const core = this.walletCore.getCore();
    const { coinType } = resolveTronWalletCoreConfig(core);
    const signingInput = this.decodeSigningInput(
      input.payload,
      'TRON_SIGNING_INPUT_INVALID',
      'TRON signing payload invalid',
    );
    if (!signingInput.transaction) {
      throw new AdapterError(
        'TRON_SIGNING_INPUT_INVALID',
        'TRON signing payload missing transaction',
      );
    }

    try {
      signingInput.privateKey = this.decodePrivateKey(input.privateKey, core);
      if (input.txId) {
        signingInput.txId = input.txId;
      }

      const output = this.signWithInput(signingInput, core, coinType);
      const signedJson = output.json || '';

      return {
        txId: core.HexCoding.encode(output.id),
        signature: core.HexCoding.encode(output.signature),
        refBlockBytes: core.HexCoding.encode(output.refBlockBytes),
        refBlockHash: core.HexCoding.encode(output.refBlockHash),
        rawDataHex: this.extractRawDataHex(signedJson),
        signedJson,
        visible: false,
      };
    } catch (error: unknown) {
      if (error instanceof AdapterError) {
        throw error;
      }
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError('TRON_SIGNING_FAILED', 'TRON signing failed', {
        cause,
      });
    }
  }

  private createBaseTransaction(input: {
    timestamp: string;
    expiration: string;
    blockId: string;
    blockNumber: string;
    feeLimit?: string;
    memo?: string;
  }): Partial<TW.Tron.Proto.ITransaction> {
    const baseTransaction: Partial<TW.Tron.Proto.ITransaction> = {
      timestamp: this.toLong(input.timestamp),
      expiration: this.toLong(input.expiration),
      blockHeader: this.createBlockHeader(input.blockId, input.blockNumber),
    };
    if (input.feeLimit) {
      baseTransaction.feeLimit = this.toLong(input.feeLimit);
    }
    if (input.memo) {
      baseTransaction.memo = input.memo;
    }
    return baseTransaction;
  }

  private createBlockHeader(
    blockId: string,
    blockNumber: string,
  ): TW.Tron.Proto.BlockHeader {
    const core = this.walletCore.getCore();
    return TW.Tron.Proto.BlockHeader.create({
      number: this.toLong(blockNumber),
      parentHash: core.HexCoding.decode(this.normalizeHexBytes(blockId)),
    });
  }

  private createSigningInput(
    transaction: TW.Tron.Proto.ITransaction,
  ): TW.Tron.Proto.SigningInput {
    return TW.Tron.Proto.SigningInput.create({
      transaction,
    });
  }

  private encodeSigningInput(signingInput: TW.Tron.Proto.SigningInput): string {
    const core = this.walletCore.getCore();
    const inputBytes = TW.Tron.Proto.SigningInput.encode(signingInput).finish();
    return core.HexCoding.encode(inputBytes);
  }

  private decodeSigningInput(
    payload: string,
    errorCode: string,
    errorMessage: string,
  ): TW.Tron.Proto.SigningInput {
    const core = this.walletCore.getCore();
    try {
      const normalized = this.normalizeHexBytes(payload);
      const payloadBytes = core.HexCoding.decode(normalized);
      return TW.Tron.Proto.SigningInput.decode(payloadBytes);
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(errorCode, errorMessage, { cause });
    }
  }

  private signWithInput(
    signingInput: TW.Tron.Proto.SigningInput,
    core: ReturnType<WalletCoreAdapter['getCore']>,
    coinType: ReturnType<typeof resolveTronWalletCoreConfig>['coinType'],
  ): TW.Tron.Proto.SigningOutput {
    const inputBytes = TW.Tron.Proto.SigningInput.encode(signingInput).finish();
    const signedBytes = core.AnySigner.sign(inputBytes, coinType);
    const output = TW.Tron.Proto.SigningOutput.decode(signedBytes);

    if (output.error !== TW.Common.Proto.SigningError.OK) {
      throw new AdapterError(
        'TRON_SIGNING_FAILED',
        output.errorMessage || 'TRON signing failed',
        {
          error: output.error,
          errorMessage: output.errorMessage,
        },
      );
    }

    return output;
  }

  private resolveTransactionIntent(
    transaction: TW.Tron.Proto.ITransaction,
  ): TronTransactionIntent {
    if (transaction.transfer) {
      return {
        type: 'trx',
        ownerAddress: this.requireString(
          transaction.transfer.ownerAddress,
          'ownerAddress',
        ),
        toAddress: this.requireString(
          transaction.transfer.toAddress,
          'toAddress',
        ),
        amount: this.longToDecimal(
          this.requireLong(transaction.transfer.amount, 'amount'),
        ),
        timestamp: this.longToDecimal(
          this.requireLong(transaction.timestamp, 'timestamp'),
        ),
        expiration: this.longToDecimal(
          this.requireLong(transaction.expiration, 'expiration'),
        ),
        feeLimit: this.resolveOptionalLong(transaction.feeLimit),
        memo: this.normalizeOptionalString(transaction.memo),
      };
    }

    if (transaction.transferTrc20Contract) {
      return {
        type: 'trc20',
        ownerAddress: this.requireString(
          transaction.transferTrc20Contract.ownerAddress,
          'ownerAddress',
        ),
        toAddress: this.requireString(
          transaction.transferTrc20Contract.toAddress,
          'toAddress',
        ),
        amount: this.bytesToDecimal(
          this.requireBytes(transaction.transferTrc20Contract.amount, 'amount'),
        ),
        contractAddress: this.requireString(
          transaction.transferTrc20Contract.contractAddress,
          'contractAddress',
        ),
        callValue: null,
        timestamp: this.longToDecimal(
          this.requireLong(transaction.timestamp, 'timestamp'),
        ),
        expiration: this.longToDecimal(
          this.requireLong(transaction.expiration, 'expiration'),
        ),
        feeLimit: this.resolveOptionalLong(transaction.feeLimit),
        memo: this.normalizeOptionalString(transaction.memo),
      };
    }

    throw new AdapterError(
      'TRON_TRANSACTION_BUILD_INCOMPLETE',
      'TRON transaction payload missing contract data',
    );
  }

  private extractRawDataHex(signedJson: string): string {
    if (!signedJson) {
      return '';
    }
    try {
      const parsed = JSON.parse(signedJson) as { raw_data_hex?: string };
      if (typeof parsed.raw_data_hex !== 'string') {
        return '';
      }
      return parsed.raw_data_hex;
    } catch {
      return '';
    }
  }

  private ensureZeroCallValue(callValue?: string): void {
    if (!callValue) {
      return;
    }
    const value = BigInt(callValue);
    if (value !== 0n) {
      throw new AdapterError(
        'TRON_TRC20_CALL_VALUE_UNSUPPORTED',
        'TRON TRC20 callValue is not supported by wallet-core proto',
        { callValue },
      );
    }
  }

  private toAmountBytes(value: string): Uint8Array {
    const core = this.walletCore.getCore();
    const normalized = this.normalizeNumericHex(value);
    if (normalized.length === 0) {
      return new Uint8Array([0]);
    }
    const even = normalized.length % 2 === 0 ? normalized : `0${normalized}`;
    return core.HexCoding.decode(even);
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

  private resolveOptionalLong(value?: Long | number | null): string | null {
    if (value === undefined || value === null) {
      return null;
    }
    return this.longToDecimal(value);
  }

  private normalizeOptionalString(value?: string | null): string | null {
    if (!value) {
      return null;
    }
    return value;
  }

  private requireString(
    value: string | null | undefined,
    field: string,
  ): string {
    if (!value) {
      throw new AdapterError(
        'TRON_TRANSACTION_BUILD_INCOMPLETE',
        `TRON payload missing ${field}`,
        { field },
      );
    }
    return value;
  }

  private requireLong(
    value: Long | number | string | null | undefined,
    field: string,
  ): Long | number | string {
    if (value === null || value === undefined) {
      throw new AdapterError(
        'TRON_TRANSACTION_BUILD_INCOMPLETE',
        `TRON payload missing ${field}`,
        { field },
      );
    }
    return value;
  }

  private requireBytes(
    value: Uint8Array | null | undefined,
    field: string,
  ): Uint8Array {
    if (!value) {
      throw new AdapterError(
        'TRON_TRANSACTION_BUILD_INCOMPLETE',
        `TRON payload missing ${field}`,
        { field },
      );
    }
    return value;
  }

  private longToDecimal(value: Long | number | string): string {
    return Long.fromValue(value).toString(10);
  }

  private normalizeNumericHex(value: string): string {
    if (value.startsWith('0x') || value.startsWith('0X')) {
      return value.slice(2);
    }
    const asBigInt = BigInt(value);
    return asBigInt.toString(16);
  }

  private toLong(value: string): Long {
    return Long.fromString(value);
  }

  private decodePrivateKey(
    privateKey: string,
    core: ReturnType<WalletCoreAdapter['getCore']>,
  ): Uint8Array {
    return core.HexCoding.decode(this.normalizeHexBytes(privateKey));
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
