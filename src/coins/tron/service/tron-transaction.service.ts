import { Injectable, Logger } from '@nestjs/common';
import {
  TronBuildTransactionAdapterRequest,
  TronBuildTransactionAdapterResponse,
} from '../../../adapter/coins/tron/dto/tron-transaction-build.dto';
import { TronTransactionAdapter } from '../../../adapter/coins/tron/tron-transaction.adapter';
import { CoinTransactionService } from '../../contracts/coin-service.contracts';
import { BuildTronTransactionRequestDto } from '../dto/request/build-tron-transaction.request.dto';
import { BuildTronTransactionResponseDto } from '../dto/response/build-tron-transaction.response.dto';

@Injectable()
export class TronTransactionService implements CoinTransactionService<
  BuildTronTransactionRequestDto,
  BuildTronTransactionResponseDto
> {
  private readonly logger = new Logger(TronTransactionService.name);

  constructor(
    private readonly tronTransactionAdapter: TronTransactionAdapter,
  ) {}

  buildTransaction(
    request: BuildTronTransactionRequestDto,
  ): BuildTronTransactionResponseDto {
    this.logger.log('Building TRON transaction from rawJson');
    const adapterRequest: TronBuildTransactionAdapterRequest = {
      rawJson: request.rawJson,
      privateKey: request.privateKey,
      txId: request.txId,
    };

    const result: TronBuildTransactionAdapterResponse =
      this.tronTransactionAdapter.buildTransaction(adapterRequest);

    return result;
  }
}
