import { Injectable, Logger } from '@nestjs/common';
import { TW } from '@trustwallet/wallet-core';
import { resolveBtcWalletCoreConfig } from '../btc-wallet-core.config';
import type { WalletCoreResolvedCoinConfig } from '../../../common/interfaces/wallet-core-resolved-coin-config.interface';
import { AdapterError } from '../../../common/errors/adapter-error';
import { WalletCoreAdapter } from '../../../common/wallet-core/wallet-core.adapter';
import { CoinTransactionAdapter } from '../../../common/interfaces/coin-transaction-adapter.interface';
import { BtcBuildTransactionAdapterInput } from './dto/btc-transaction-build-input.dto';
import {
  BtcBuildTransactionAdapterOutput,
  BtcBuildTransactionIntent,
  BtcBuildTransactionUtxoIntent,
} from './dto/btc-transaction-build-output.dto';
import { BtcSignTransactionAdapterInput } from './dto/btc-transaction-sign-input.dto';
import { BtcSignTransactionAdapterOutput } from './dto/btc-transaction-sign-output.dto';
import Long from 'long';

/**
 * Adapter for BTC transaction build and signing using wallet-core.
 */
@Injectable()
export class BtcTransactionAdapter implements CoinTransactionAdapter<
  BtcBuildTransactionAdapterInput,
  BtcBuildTransactionAdapterOutput
> {
  private readonly logger = new Logger(BtcTransactionAdapter.name);

  constructor(private readonly walletCore: WalletCoreAdapter) {}

  /**
   * Builds a BTC transaction payload and resolved transaction intent.
   * @param input Adapter request payload.
   * @returns Build response with payload and transaction intent.
   */
  buildTransaction(
    input: BtcBuildTransactionAdapterInput,
  ): BtcBuildTransactionAdapterOutput {
    this.logger.log(`Building BTC transaction (utxos=${input.utxos.length})`);
    const core = this.walletCore.getCore();
    const { coinType } = resolveBtcWalletCoreConfig(core);

    try {
      const signingInput = this.createSigningInput(input, coinType.value);
      const plan = this.planForInput(signingInput, coinType);
      signingInput.plan = plan;

      return {
        payload: this.encodeSigningInput(signingInput),
        transaction: this.resolveTransaction(signingInput, plan, input),
      };
    } catch (error: unknown) {
      if (error instanceof AdapterError) {
        throw error;
      }
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'BTC_TRANSACTION_BUILD_FAILED',
        'BTC transaction build failed',
        {
          cause,
        },
      );
    }
  }

  /**
   * Signs a BTC transaction payload.
   * @param input Adapter request payload.
   * @returns Signed transaction response.
   */
  signTransaction(
    input: BtcSignTransactionAdapterInput,
  ): BtcSignTransactionAdapterOutput {
    this.logger.log('Signing BTC transaction');
    const core = this.walletCore.getCore();
    const { coinType } = resolveBtcWalletCoreConfig(core);

    const signingInput = this.decodeSigningInput(
      input.payload,
      'BTC_SIGNING_INPUT_INVALID',
      'BTC transaction signing payload invalid',
    );

    try {
      signingInput.privateKey = input.privateKeys.map((key) =>
        core.HexCoding.decode(this.normalizeHexBytes(key)),
      );

      const plan = this.requirePlan(signingInput);
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
    } catch (error: unknown) {
      if (error instanceof AdapterError) {
        throw error;
      }
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'BTC_TRANSACTION_SIGNING_FAILED',
        'BTC signing failed',
        {
          cause,
        },
      );
    }
  }

  private createSigningInput(
    input: BtcBuildTransactionAdapterInput,
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
    coinType: WalletCoreResolvedCoinConfig['coinType'],
  ): TW.Bitcoin.Proto.TransactionPlan {
    const core = this.walletCore.getCore();
    const inputBytes =
      TW.Bitcoin.Proto.SigningInput.encode(signingInput).finish();
    const planBytes = core.AnySigner.plan(inputBytes, coinType);
    return TW.Bitcoin.Proto.TransactionPlan.decode(planBytes);
  }

  private requirePlan(
    signingInput: TW.Bitcoin.Proto.SigningInput,
  ): TW.Bitcoin.Proto.TransactionPlan {
    if (signingInput.plan) {
      return signingInput.plan as TW.Bitcoin.Proto.TransactionPlan;
    }
    throw new AdapterError(
      'BTC_TRANSACTION_PLAN_MISSING',
      'BTC transaction plan is required for signing',
    );
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
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(errorCode, errorMessage, { cause });
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

  private resolveTransaction(
    signingInput: TW.Bitcoin.Proto.SigningInput,
    plan: TW.Bitcoin.Proto.TransactionPlan,
    input: BtcBuildTransactionAdapterInput,
  ): BtcBuildTransactionIntent {
    return {
      toAddress: this.requireString(signingInput.toAddress, 'toAddress'),
      changeAddress: this.requireString(
        signingInput.changeAddress,
        'changeAddress',
      ),
      amount: this.toLongString(signingInput.amount),
      byteFee: this.toLongString(signingInput.byteFee),
      utxos: this.resolveUtxos(signingInput, input),
      hashType: signingInput.hashType ?? 1,
      useMaxAmount: signingInput.useMaxAmount ?? false,
      plan: this.toPlanResponse(plan),
    };
  }

  private resolveUtxos(
    signingInput: TW.Bitcoin.Proto.SigningInput,
    input: BtcBuildTransactionAdapterInput,
  ): BtcBuildTransactionUtxoIntent[] {
    const core = this.walletCore.getCore();
    const utxos = signingInput.utxo ?? [];
    if (utxos.length !== input.utxos.length) {
      throw new AdapterError(
        'BTC_TRANSACTION_BUILD_INCOMPLETE',
        'BTC signing input missing UTXO data',
      );
    }

    return utxos.map((utxo, index) => {
      const outPoint = utxo.outPoint;
      if (!outPoint?.hash) {
        throw new AdapterError(
          'BTC_TRANSACTION_BUILD_INCOMPLETE',
          'BTC signing input missing outpoint hash',
        );
      }

      const reverseTxId = input.utxos[index]?.reverseTxId ?? true;
      const hashBytes = new Uint8Array(outPoint.hash);
      const displayHash = reverseTxId
        ? Uint8Array.from(hashBytes).reverse()
        : hashBytes;
      const script = utxo.script;
      if (!script) {
        throw new AdapterError(
          'BTC_TRANSACTION_BUILD_INCOMPLETE',
          'BTC signing input missing scriptPubKey',
        );
      }

      return {
        txid: core.HexCoding.encode(displayHash),
        vout: outPoint.index ?? 0,
        amount: this.toLongString(utxo.amount),
        scriptPubKey: Buffer.from(script).toString('base64'),
        reverseTxId,
      };
    });
  }

  private toLongString(value: Long | number | null | undefined): string {
    if (value === undefined || value === null) {
      return '0';
    }
    if (typeof value === 'number') {
      return String(value);
    }
    return value.toString();
  }

  private requireString(value: string | undefined, field: string): string {
    if (!value) {
      throw new AdapterError(
        'BTC_TRANSACTION_BUILD_INCOMPLETE',
        `BTC signing input missing ${field}`,
        { field },
      );
    }
    return value;
  }
}
