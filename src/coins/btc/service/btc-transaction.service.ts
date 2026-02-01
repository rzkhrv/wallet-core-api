import { Injectable, Logger } from '@nestjs/common';
import { BtcBuildTransactionAdapterRequest } from '../../../adapter/coins/btc/dto/btc-transaction-build.dto';
import { BtcBuildTransactionAdapterResponse } from '../../../adapter/coins/btc/dto/btc-transaction-build-response.dto';
import { BtcSignTransactionAdapterRequest } from '../../../adapter/coins/btc/dto/btc-transaction-sign.dto';
import { BtcSignTransactionAdapterResponse } from '../../../adapter/coins/btc/dto/btc-transaction-sign-response.dto';
import { BtcTransactionAdapter } from '../../../adapter/coins/btc/btc-transaction.adapter';
import { CoinTransactionService } from '../../contracts/coin-transaction-service.interface';
import { BuildBtcTransactionRequestDto } from '../dto/request/build-btc-transaction.request.dto';
import { SignBtcTransactionRequestDto } from '../dto/request/sign-btc-transaction.request.dto';
import { BuildBtcTransactionResponseDto } from '../dto/response/build-btc-transaction.response.dto';
import { SignBtcTransactionResponseDto } from '../dto/response/sign-btc-transaction.response.dto';

/**
 * Provides BTC transaction build and signing operations.
 */
@Injectable()
export class BtcTransactionService implements CoinTransactionService<
  BuildBtcTransactionRequestDto,
  BuildBtcTransactionResponseDto
> {
  private readonly logger = new Logger(BtcTransactionService.name);

  constructor(private readonly btcTransactionAdapter: BtcTransactionAdapter) {}

  /**
   * Builds a BTC transaction payload.
   * @param request Request payload.
   * @returns Unsigned transaction response.
   */
  buildTransaction(
    request: BuildBtcTransactionRequestDto,
  ): BuildBtcTransactionResponseDto {
    this.logger.log('Building BTC transaction');
    const adapterRequest: BtcBuildTransactionAdapterRequest = {
      toAddress: request.toAddress,
      changeAddress: request.changeAddress,
      amount: request.amount,
      byteFee: request.byteFee,
      utxos: request.utxos.map((utxo) => ({
        txid: utxo.txid,
        vout: utxo.vout,
        amount: utxo.amount,
        scriptPubKey: utxo.scriptPubKey,
        reverseTxId: utxo.reverseTxId,
      })),
      hashType: request.hashType,
      useMaxAmount: request.useMaxAmount,
    };

    const result: BtcBuildTransactionAdapterResponse =
      this.btcTransactionAdapter.buildTransaction(adapterRequest);

    return result;
  }

  /**
   * Signs a BTC transaction payload.
   * @param request Request payload.
   * @returns Signed transaction response.
   */
  signTransaction(
    request: SignBtcTransactionRequestDto,
  ): SignBtcTransactionResponseDto {
    this.logger.log('Signing BTC transaction');
    const adapterRequest: BtcSignTransactionAdapterRequest = {
      payload: request.payload,
      privateKeys: request.privateKeys,
    };

    const result: BtcSignTransactionAdapterResponse =
      this.btcTransactionAdapter.signTransaction(adapterRequest);

    return result;
  }
}
