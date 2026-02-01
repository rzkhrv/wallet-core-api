import { Injectable, Logger } from '@nestjs/common';
import { BtcBuildTransactionAdapterInput } from '../adapter/dto/btc-transaction-build-input.dto';
import { BtcBuildTransactionAdapterOutput } from '../adapter/dto/btc-transaction-build-output.dto';
import { BtcSignTransactionAdapterInput } from '../adapter/dto/btc-transaction-sign-input.dto';
import { BtcSignTransactionAdapterOutput } from '../adapter/dto/btc-transaction-sign-output.dto';
import { BtcTransactionAdapter } from '../adapter/btc-transaction.adapter';
import { CoinTransactionService } from '../../../common/interfaces/coin-transaction-service.interface';
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
    const adapterRequest: BtcBuildTransactionAdapterInput = {
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

    const result: BtcBuildTransactionAdapterOutput =
      this.btcTransactionAdapter.buildTransaction(adapterRequest);

    return result;
  }

  /**
   * Signs a BTC transaction payload.
   * @param request Request payload.
   * @returns Signed transaction response.
   */
  sign(request: SignBtcTransactionRequestDto): SignBtcTransactionResponseDto {
    this.logger.log('Signing BTC transaction');
    const adapterRequest: BtcSignTransactionAdapterInput = {
      payload: request.payload,
      privateKeys: request.privateKeys,
    };

    const result: BtcSignTransactionAdapterOutput =
      this.btcTransactionAdapter.signTransaction(adapterRequest);

    return result;
  }
}
