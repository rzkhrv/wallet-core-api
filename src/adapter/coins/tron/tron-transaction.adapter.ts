import { Injectable, Logger } from '@nestjs/common';
import { TW } from '@trustwallet/wallet-core';
import Long from 'long';
import { resolveCoinConfig } from '../../../coins/coin.config';
import { Coin } from '../../../coins/enum/coin.enum';
import { AdapterError } from '../../common/adapter-error';
import { WalletCoreAdapter } from '../../common/wallet-core.adapter';
import { CoinTransactionAdapter } from '../coin-adapter.contracts';
import {
  TronBuildTransactionAdapterRequest,
  TronBuildTransactionAdapterResponse,
} from './dto/tron-transaction-build.dto';
import { TronBuildTransferAdapterRequest } from './dto/tron-transaction-build-transfer.dto';
import {
  TronSignRawTransactionAdapterRequest,
  TronSignRawTransactionAdapterResponse,
} from './dto/tron-transaction-sign-raw.dto';

@Injectable()
export class TronTransactionAdapter implements CoinTransactionAdapter<
  TronBuildTransactionAdapterRequest,
  TronBuildTransactionAdapterResponse,
  TronBuildTransferAdapterRequest,
  TronBuildTransactionAdapterResponse
> {
  private readonly logger = new Logger(TronTransactionAdapter.name);

  constructor(private readonly walletCore: WalletCoreAdapter) {}

  buildTransfer(
    input: TronBuildTransferAdapterRequest,
  ): TronBuildTransactionAdapterResponse {
    this.logger.log('Building TRON transfer');
    return this.buildTransaction(input);
  }

  buildTransaction(
    input: TronBuildTransactionAdapterRequest,
  ): TronBuildTransactionAdapterResponse {
    this.logger.log('Building TRON transaction');
    const transferType = input.transferType ?? 'trx';
    const now = Date.now();
    const timestamp = input.timestamp
      ? Long.fromString(input.timestamp)
      : Long.fromNumber(now);
    const expiration = input.expiration
      ? Long.fromString(input.expiration)
      : Long.fromNumber(now + 60_000);

    const baseTransaction: Partial<TW.Tron.Proto.ITransaction> = {
      timestamp,
      expiration,
    };

    if (input.feeLimit) {
      baseTransaction.feeLimit = Long.fromString(input.feeLimit);
    }

    if (input.memo) {
      baseTransaction.memo = input.memo;
    }

    let transaction: TW.Tron.Proto.Transaction;

    if (transferType === 'trc10') {
      const transferAsset = TW.Tron.Proto.TransferAssetContract.create({
        ownerAddress: input.ownerAddress,
        toAddress: input.toAddress,
        assetName: input.assetName ?? '',
        amount: Long.fromString(input.amount),
      });
      transaction = TW.Tron.Proto.Transaction.create({
        ...baseTransaction,
        transferAsset,
      });
    } else {
      const transfer = TW.Tron.Proto.TransferContract.create({
        ownerAddress: input.ownerAddress,
        toAddress: input.toAddress,
        amount: Long.fromString(input.amount),
      });
      transaction = TW.Tron.Proto.Transaction.create({
        ...baseTransaction,
        transfer,
      });
    }

    return {
      rawJson: JSON.stringify(transaction.toJSON()),
    };
  }

  signTransaction(
    input: TronSignRawTransactionAdapterRequest,
  ): TronSignRawTransactionAdapterResponse {
    const core = this.walletCore.getCore();
    const { coinType } = resolveCoinConfig(core, Coin.TRON);

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
    } catch (error) {
      if (error instanceof AdapterError) {
        throw error;
      }
      throw new AdapterError(
        'TRON_TRANSACTION_SIGN_FAILED',
        'TRON transaction signing failed',
        {
          cause: error instanceof Error ? error.message : error,
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

  private normalizeHex(value: string): string {
    const stripped =
      value.startsWith('0x') || value.startsWith('0X') ? value.slice(2) : value;
    if (stripped.length % 2 === 1) {
      return `0${stripped}`;
    }
    return stripped;
  }
}
