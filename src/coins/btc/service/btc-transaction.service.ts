import { Injectable, Logger } from '@nestjs/common';
import {
  BtcBuildTransactionAdapterRequest,
  BtcBuildTransactionAdapterResponse,
} from '../../../adapter/coins/btc/dto/btc-transaction-build.dto';
import { BtcTransactionAdapter } from '../../../adapter/coins/btc/btc-transaction.adapter';
import { CoinTransactionService } from '../../contracts/coin-service.contracts';
import { BuildBtcTransactionRequestDto } from '../dto/request/build-btc-transaction.request.dto';
import { BuildBtcTransactionResponseDto } from '../dto/response/build-btc-transaction.response.dto';

@Injectable()
export class BtcTransactionService implements CoinTransactionService<
  BuildBtcTransactionRequestDto,
  BuildBtcTransactionResponseDto
> {
  private readonly logger = new Logger(BtcTransactionService.name);

  constructor(private readonly btcTransactionAdapter: BtcTransactionAdapter) {}

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
      privateKeys: request.privateKeys,
      hashType: request.hashType,
      useMaxAmount: request.useMaxAmount,
    };

    const result: BtcBuildTransactionAdapterResponse =
      this.btcTransactionAdapter.buildTransaction(adapterRequest);

    return result;
  }
}
