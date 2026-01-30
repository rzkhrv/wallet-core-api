import { Injectable, Logger } from '@nestjs/common';
import { TW } from '@trustwallet/wallet-core';
import { resolveCoinConfig } from '../../../coins/coin.config';
import { Coin } from '../../../coins/enum/coin.enum';
import { AdapterError } from '../../common/adapter-error';
import { WalletCoreAdapter } from '../../common/wallet-core.adapter';
import { CoinTransactionAdapter } from '../coin-adapter.contracts';
import {
  TronBuildTransactionAdapterRequest,
  TronBuildTransactionAdapterResponse,
} from './dto/tron-transaction-build.dto';

@Injectable()
export class TronTransactionAdapter implements CoinTransactionAdapter<
  TronBuildTransactionAdapterRequest,
  TronBuildTransactionAdapterResponse
> {
  private readonly logger = new Logger(TronTransactionAdapter.name);

  constructor(private readonly walletCore: WalletCoreAdapter) {}

  buildTransaction(
    input: TronBuildTransactionAdapterRequest,
  ): TronBuildTransactionAdapterResponse {
    this.logger.log('Signing TRON raw transaction');
    const core = this.walletCore.getCore();
    const { coinType } = resolveCoinConfig(core, Coin.TRON);

    if (!input.rawJson && !input.transaction) {
      throw new AdapterError(
        'TRON_TRANSACTION_INPUT_MISSING',
        'TRON transaction input is missing',
      );
    }

    try {
      const signingInput = TW.Tron.Proto.SigningInput.create({
        rawJson: input.rawJson ?? '',
        txId: input.txId ?? '',
        transaction: input.transaction,
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
        'TRON_TRANSACTION_BUILD_FAILED',
        'TRON transaction build failed',
        {
          cause: error instanceof Error ? error.message : error,
        },
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
