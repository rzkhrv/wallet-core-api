import { Injectable, Logger } from '@nestjs/common';
import { TW } from '@trustwallet/wallet-core';
import {
  resolveCoinConfig,
  type ResolvedCoinConfig,
} from '../../../coins/coin.config';
import { Coin } from '../../../coins/enum/coin.enum';
import { AdapterError } from '../../common/adapter-error';
import { WalletCoreAdapter } from '../../common/wallet-core.adapter';
import { CoinTransactionAdapter } from '../coin-adapter.contracts';
import {
  BtcBuildTransactionAdapterRequest,
  BtcBuildTransactionAdapterResponse,
} from './dto/btc-transaction-build.dto';
import {
  BtcSignTransactionAdapterRequest,
  BtcSignTransactionAdapterResponse,
} from './dto/btc-transaction-sign.dto';
import Long from 'long';

@Injectable()
export class BtcTransactionAdapter implements CoinTransactionAdapter<
  BtcBuildTransactionAdapterRequest,
  BtcBuildTransactionAdapterResponse
> {
  private readonly logger = new Logger(BtcTransactionAdapter.name);

  constructor(private readonly walletCore: WalletCoreAdapter) {}

  buildTransaction(
    input: BtcBuildTransactionAdapterRequest,
  ): BtcBuildTransactionAdapterResponse {
    this.logger.log(`Building BTC transaction (utxos=${input.utxos.length})`);
    const core = this.walletCore.getCore();
    const { coinType } = resolveCoinConfig(core, Coin.BTC);

    try {
      const signingInput = this.createSigningInput(input, coinType.value);
      const plan = this.planForInput(signingInput, coinType);
      signingInput.plan = plan;

      return {
        payload: this.encodeSigningInput(signingInput),
        plan: this.toPlanResponse(plan),
      };
    } catch (error) {
      if (error instanceof AdapterError) {
        throw error;
      }
      throw new AdapterError(
        'BTC_TRANSACTION_BUILD_FAILED',
        'BTC transaction build failed',
        {
          cause: error instanceof Error ? error.message : error,
        },
      );
    }
  }

  signTransaction(
    input: BtcSignTransactionAdapterRequest,
  ): BtcSignTransactionAdapterResponse {
    this.logger.log('Signing BTC transaction');
    const core = this.walletCore.getCore();
    const { coinType } = resolveCoinConfig(core, Coin.BTC);

    const signingInput = this.decodeSigningInput(
      input.payload,
      'BTC_SIGNING_INPUT_INVALID',
      'BTC transaction signing payload invalid',
    );

    try {
      signingInput.privateKey = input.privateKeys.map((key) =>
        core.HexCoding.decode(this.normalizeHexBytes(key)),
      );

      const plan = this.ensurePlan(signingInput, coinType);
      signingInput.plan = plan;

      const signedBytes = core.AnySigner.sign(
        TW.Bitcoin.Proto.SigningInput.encode(signingInput).finish(),
        coinType,
      );
      const output = TW.Bitcoin.Proto.SigningOutput.decode(signedBytes);

      if (output.error !== TW.Common.Proto.SigningError.OK) {
        throw new AdapterError(
          'BTC_TRANSACTION_SIGNING_FAILED',
          output.errorMessage || 'BTC signing failed',
          {
            error: output.error,
            errorMessage: output.errorMessage,
          },
        );
      }

      return {
        rawTx: core.HexCoding.encode(output.encoded),
        txId: output.transactionId,
        plan: this.toPlanResponse(plan),
      };
    } catch (error) {
      if (error instanceof AdapterError) {
        throw error;
      }
      throw new AdapterError(
        'BTC_TRANSACTION_SIGNING_FAILED',
        'BTC signing failed',
        {
          cause: error instanceof Error ? error.message : error,
        },
      );
    }
  }

  private createSigningInput(
    input: BtcBuildTransactionAdapterRequest,
    coinType: number,
  ): TW.Bitcoin.Proto.SigningInput {
    const core = this.walletCore.getCore();
    const utxos = input.utxos.map((utxo) => {
      const hashBytes = core.HexCoding.decode(utxo.txid);
      if (utxo.reverseTxId ?? true) {
        hashBytes.reverse();
      }

      return TW.Bitcoin.Proto.UnspentTransaction.create({
        outPoint: {
          hash: hashBytes,
          index: utxo.vout,
        },
        amount: Long.fromString(utxo.amount),
        script: core.HexCoding.decode(utxo.scriptPubKey),
      });
    });

    return TW.Bitcoin.Proto.SigningInput.create({
      hashType: input.hashType ?? 1,
      amount: Long.fromString(input.amount),
      byteFee: Long.fromString(input.byteFee),
      toAddress: input.toAddress,
      changeAddress: input.changeAddress,
      utxo: utxos,
      useMaxAmount: input.useMaxAmount ?? false,
      coinType,
    });
  }

  private planForInput(
    signingInput: TW.Bitcoin.Proto.SigningInput,
    coinType: ResolvedCoinConfig['coinType'],
  ): TW.Bitcoin.Proto.TransactionPlan {
    const core = this.walletCore.getCore();
    const inputBytes =
      TW.Bitcoin.Proto.SigningInput.encode(signingInput).finish();
    const planBytes = core.AnySigner.plan(inputBytes, coinType);
    return TW.Bitcoin.Proto.TransactionPlan.decode(planBytes);
  }

  private ensurePlan(
    signingInput: TW.Bitcoin.Proto.SigningInput,
    coinType: ResolvedCoinConfig['coinType'],
  ): TW.Bitcoin.Proto.TransactionPlan {
    if (signingInput.plan) {
      return signingInput.plan as TW.Bitcoin.Proto.TransactionPlan;
    }
    return this.planForInput(signingInput, coinType);
  }

  private encodeSigningInput(
    signingInput: TW.Bitcoin.Proto.SigningInput,
  ): string {
    const core = this.walletCore.getCore();
    const inputBytes =
      TW.Bitcoin.Proto.SigningInput.encode(signingInput).finish();
    return core.HexCoding.encode(inputBytes);
  }

  private decodeSigningInput(
    payload: string,
    errorCode: string,
    errorMessage: string,
  ): TW.Bitcoin.Proto.SigningInput {
    const core = this.walletCore.getCore();
    try {
      const normalized = this.normalizeHexBytes(payload);
      const payloadBytes = core.HexCoding.decode(normalized);
      return TW.Bitcoin.Proto.SigningInput.decode(payloadBytes);
    } catch (error) {
      throw new AdapterError(errorCode, errorMessage, {
        cause: error instanceof Error ? error.message : error,
      });
    }
  }

  private toPlanResponse(plan: TW.Bitcoin.Proto.TransactionPlan): {
    amount: string;
    availableAmount: string;
    fee: string;
    change: string;
  } {
    return {
      amount: plan.amount?.toString?.() ?? String(plan.amount ?? ''),
      availableAmount:
        plan.availableAmount?.toString?.() ??
        String(plan.availableAmount ?? ''),
      fee: plan.fee?.toString?.() ?? String(plan.fee ?? ''),
      change: plan.change?.toString?.() ?? String(plan.change ?? ''),
    };
  }

  private normalizeHex(value: string): string {
    return value.startsWith('0x') || value.startsWith('0X')
      ? value.slice(2)
      : value;
  }

  private normalizeHexBytes(value: string): string {
    const normalized = this.normalizeHex(value);
    if (normalized.length === 0) {
      return normalized;
    }
    return normalized.length % 2 === 0 ? normalized : `0${normalized}`;
  }
}
