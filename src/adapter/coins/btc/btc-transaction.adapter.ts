import { Injectable, Logger } from '@nestjs/common';
import { TW } from '@trustwallet/wallet-core';
import { resolveCoinConfig } from '../../../coins/coin.config';
import { Coin } from '../../../coins/enum/coin.enum';
import { AdapterError } from '../../common/adapter-error';
import { WalletCoreAdapter } from '../../common/wallet-core.adapter';
import { CoinTransactionAdapter } from '../coin-adapter.contracts';
import {
  BtcBuildTransactionAdapterRequest,
  BtcBuildTransactionAdapterResponse,
} from './dto/btc-transaction-build.dto';
import Long from "long";

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
          amount: new Long(Number(utxo.amount)),
          script: core.HexCoding.decode(utxo.scriptPubKey),
        });
      });

      const privateKeys = input.privateKeys.map((key) =>
        core.HexCoding.decode(key),
      );

      const signingInput = TW.Bitcoin.Proto.SigningInput.create({
        hashType: input.hashType ?? 1,
        amount: new Long(Number(input.amount)),
        byteFee: new Long(Number(input.byteFee)),
        toAddress: input.toAddress,
        changeAddress: input.changeAddress,
        privateKey: privateKeys,
        utxo: utxos,
        useMaxAmount: input.useMaxAmount ?? false,
        coinType: coinType.value,
      });

      const inputBytes =
        TW.Bitcoin.Proto.SigningInput.encode(signingInput).finish();
      const planBytes = core.AnySigner.plan(inputBytes, coinType);
      const plan = TW.Bitcoin.Proto.TransactionPlan.decode(planBytes);

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
        plan: {
          amount: plan.amount?.toString?.() ?? String(plan.amount ?? ''),
          availableAmount:
            plan.availableAmount?.toString?.() ??
            String(plan.availableAmount ?? ''),
          fee: plan.fee?.toString?.() ?? String(plan.fee ?? ''),
          change: plan.change?.toString?.() ?? String(plan.change ?? ''),
        },
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
}
