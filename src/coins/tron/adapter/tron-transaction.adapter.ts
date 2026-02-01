import { Injectable, Logger } from '@nestjs/common';
import { TW } from '@trustwallet/wallet-core';
import Long from 'long';
import { resolveTronWalletCoreConfig } from '../tron-wallet-core.config';
import { AdapterError } from '../../../common/errors/adapter-error';
import { WalletCoreAdapter } from '../../../common/wallet-core/wallet-core.adapter';
import { CoinTransactionAdapter } from '../../../common/interfaces/coin-transaction-adapter.interface';
import { TronTransactionBuildAdapterInput } from './dto/tron-transaction-build-input.dto';
import { TronTransactionBuildAdapterOutput } from './dto/tron-transaction-build-output.dto';
import { TronTransferBuildAdapterInput } from './dto/tron-transfer-build-input.dto';
import { TronSignRawTransactionAdapterInput } from './dto/tron-transaction-sign-raw-input.dto';
import { TronSignRawTransactionAdapterOutput } from './dto/tron-transaction-sign-raw-output.dto';

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
    const baseTransaction = this.createBaseTransaction(input);
    let transaction: TW.Tron.Proto.Transaction;
    if (input.transferType === 'trc20') {
      if (!input.contractAddress) {
        throw new AdapterError(
          'TRON_TRC20_CONTRACT_ADDRESS_REQUIRED',
          'TRON TRC20 contract address is required',
        );
      }
      const triggerSmartContract = this.buildTrc20TransferContract(input);
      transaction = TW.Tron.Proto.Transaction.create({
        ...baseTransaction,
        triggerSmartContract,
      });
    } else {
      const transferAsset = TW.Tron.Proto.TransferAssetContract.create({
        ownerAddress: input.ownerAddress,
        toAddress: input.toAddress,
        assetName: input.assetName ?? '',
        amount: this.toLong(input.amount),
      });
      transaction = TW.Tron.Proto.Transaction.create({
        ...baseTransaction,
        transferAsset,
      });
    }
    return {
      rawJson: JSON.stringify(transaction.toJSON()),
    };
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
    return {
      rawJson: JSON.stringify(transaction.toJSON()),
    };
  }

  private createBaseTransaction(input: {
    timestamp?: string;
    expiration?: string;
    feeLimit?: string;
    memo?: string;
  }): Partial<TW.Tron.Proto.ITransaction> {
    const now = Date.now();
    const timestamp = input.timestamp
      ? this.toLong(input.timestamp)
      : Long.fromNumber(now);
    const expiration = input.expiration
      ? this.toLong(input.expiration)
      : Long.fromNumber(now + 60_000);
    const baseTransaction: Partial<TW.Tron.Proto.ITransaction> = {
      timestamp,
      expiration,
    };
    if (input.feeLimit) {
      baseTransaction.feeLimit = this.toLong(input.feeLimit);
    }
    if (input.memo) {
      baseTransaction.memo = input.memo;
    }
    return baseTransaction;
  }

  /**
   * Signs a TRON transaction payload.
   * @param input Adapter request payload.
   * @returns Signed transaction response.
   */
  signTransaction(
    input: TronSignRawTransactionAdapterInput,
  ): TronSignRawTransactionAdapterOutput {
    const core = this.walletCore.getCore();
    const { coinType } = resolveTronWalletCoreConfig(core);

    const resolvedInput = this.resolveSigningInput(input.rawJson);

    try {
      const signingInput = TW.Tron.Proto.SigningInput.create({
        rawJson: resolvedInput.rawJson,
        txId: input.txId ?? '',
        transaction: resolvedInput.transaction,
        privateKey: core.HexCoding.decode(this.normalizeHex(input.privateKey)),
      });

      const inputBytes =
        TW.Tron.Proto.SigningInput.encode(signingInput).finish();
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

      return {
        txId: core.HexCoding.encode(output.id),
        signature: core.HexCoding.encode(output.signature),
        refBlockBytes: core.HexCoding.encode(output.refBlockBytes),
        refBlockHash: core.HexCoding.encode(output.refBlockHash),
        signedJson: output.json,
      };
    } catch (error: unknown) {
      if (error instanceof AdapterError) {
        throw error;
      }
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'TRON_TRANSACTION_SIGN_FAILED',
        'TRON transaction signing failed',
        {
          cause,
        },
      );
    }
  }

  private resolveSigningInput(rawJson: string): {
    rawJson: string;
    transaction?: TW.Tron.Proto.ITransaction;
  } {
    try {
      const parsed = JSON.parse(rawJson) as Record<string, unknown>;
      if (parsed?.raw_data) {
        return { rawJson };
      }
      return {
        rawJson: '',
        transaction: TW.Tron.Proto.Transaction.fromObject(parsed),
      };
    } catch {
      throw new AdapterError(
        'TRON_RAW_JSON_INVALID',
        'TRON raw JSON is invalid',
      );
    }
  }

  private buildTrc20TransferContract(
    input: TronTransferBuildAdapterInput,
  ): TW.Tron.Proto.TriggerSmartContract {
    const triggerSmartContract = TW.Tron.Proto.TriggerSmartContract.create({
      ownerAddress: input.ownerAddress,
      contractAddress: input.contractAddress ?? '',
      data: this.encodeTrc20TransferData(input.toAddress, input.amount),
    });

    if (input.callValue) {
      triggerSmartContract.callValue = this.toLong(input.callValue);
    }

    return triggerSmartContract;
  }

  private encodeTrc20TransferData(
    toAddress: string,
    amount: string,
  ): Uint8Array {
    const core = this.walletCore.getCore();
    try {
      const selector = core.Hash.keccak256(
        Buffer.from('transfer(address,uint256)'),
      );
      const selectorBytes = selector.slice(0, 4);
      const addressBytes = this.leftPadBytes(
        this.toTronEvmAddressBytes(toAddress),
        32,
      );
      const amountBytes = this.leftPadBytes(this.toBytes(amount), 32);
      const data = new Uint8Array(4 + 32 + 32);
      data.set(selectorBytes, 0);
      data.set(addressBytes, 4);
      data.set(amountBytes, 36);
      return data;
    } catch (error: unknown) {
      if (error instanceof AdapterError) {
        throw error;
      }
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'TRON_TRC20_DATA_INVALID',
        'TRON TRC20 transfer data invalid',
        {
          cause,
        },
      );
    }
  }

  private toTronEvmAddressBytes(address: string): Uint8Array {
    const core = this.walletCore.getCore();
    const { coinType } = resolveTronWalletCoreConfig(core);

    if (!core.AnyAddress.isValid(address, coinType)) {
      throw new AdapterError(
        'TRON_ADDRESS_INVALID',
        'TRON address is invalid',
        {
          address,
        },
      );
    }

    const anyAddress = core.AnyAddress.createWithString(address, coinType);
    try {
      const data = anyAddress.data();
      const resolved = data.length === 0 ? core.Base58.decode(address) : data;
      if (resolved.length === 21) {
        return resolved.slice(1);
      }
      if (resolved.length === 20) {
        return resolved;
      }
      throw new AdapterError(
        'TRON_ADDRESS_INVALID',
        'TRON address payload is invalid',
        {
          address,
          length: resolved.length,
        },
      );
    } finally {
      anyAddress.delete();
    }
  }

  private toBytes(value: string): Uint8Array {
    const core = this.walletCore.getCore();
    const normalized = this.normalizeNumericHex(value);
    const even = normalized.length % 2 === 0 ? normalized : `0${normalized}`;
    return core.HexCoding.decode(even);
  }

  private leftPadBytes(value: Uint8Array, length: number): Uint8Array {
    if (value.length > length) {
      throw new AdapterError(
        'TRON_TRC20_VALUE_TOO_LARGE',
        'TRON TRC20 value exceeds 32 bytes',
        { length: value.length },
      );
    }
    const padded = new Uint8Array(length);
    padded.set(value, length - value.length);
    return padded;
  }

  private normalizeNumericHex(value: string): string {
    if (value.startsWith('0x') || value.startsWith('0X')) {
      return value.slice(2);
    }
    const asBigInt = BigInt(value);
    return asBigInt.toString(16);
  }

  private toLong(value: string): Long {
    if (value.startsWith('0x') || value.startsWith('0X')) {
      const normalized = value.slice(2);
      if (normalized.length === 0) {
        return Long.fromString('0');
      }
      const asBigInt = BigInt(`0x${normalized}`);
      return Long.fromString(asBigInt.toString());
    }
    return Long.fromString(value);
  }

  private normalizeHex(value: string): string {
    const stripped =
      value.startsWith('0x') || value.startsWith('0X') ? value.slice(2) : value;
    if (stripped.length % 2 === 1) {
      return `0${stripped}`;
    }
    return stripped;
  }
}
