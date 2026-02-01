import { Injectable, Logger } from '@nestjs/common';
import { TronTransactionBuildAdapterInput } from '../adapter/dto/tron-transaction-build-input.dto';
import { TronTransferBuildAdapterInput } from '../adapter/dto/tron-transfer-build-input.dto';
import { TronSignRawTransactionAdapterInput } from '../adapter/dto/tron-transaction-sign-raw-input.dto';
import { TronTransactionAdapter } from '../adapter/tron-transaction.adapter';
import { CoinTransactionService } from '../../../common/interfaces/coin-transaction-service.interface';
import { BuildTronTransactionRequestDto } from '../dto/request/build-tron-transaction.request.dto';
import { BuildTronTransferRequestDto } from '../dto/request/build-tron-transfer.request.dto';
import { SignTronRawTransactionRequestDto } from '../dto/request/sign-tron-raw-transaction.request.dto';
import { BuildTronTransactionResponseDto } from '../dto/response/build-tron-transaction.response.dto';
import { SignTronTransactionResponseDto } from '../dto/response/sign-tron-transaction.response.dto';

/**
 * Provides TRON transaction build and signing operations.
 */
@Injectable()
export class TronTransactionService implements CoinTransactionService<
  BuildTronTransactionRequestDto,
  BuildTronTransactionResponseDto,
  BuildTronTransferRequestDto,
  BuildTronTransactionResponseDto
> {
  private readonly logger = new Logger(TronTransactionService.name);

  constructor(
    private readonly tronTransactionAdapter: TronTransactionAdapter,
  ) {}

  /**
   * Builds a TRON transaction from request data.
   * @param request Request payload.
   * @returns Unsigned transaction response.
   */
  buildTransaction(
    request: BuildTronTransactionRequestDto,
  ): BuildTronTransactionResponseDto {
    this.logger.log('Building TRON TRX transaction from params');
    const adapterRequest: TronTransactionBuildAdapterInput = {
      ownerAddress: request.ownerAddress,
      toAddress: request.toAddress,
      amount: request.amount,
      timestamp: request.timestamp,
      expiration: request.expiration,
      feeLimit: request.feeLimit,
      memo: request.memo,
    };
    return this.tronTransactionAdapter.buildTransaction(adapterRequest);
  }

  /**
   * Builds a TRON token transfer from request data.
   * @param request Request payload.
   * @returns Unsigned transaction response.
   */
  buildTransfer(
    request: BuildTronTransferRequestDto,
  ): BuildTronTransactionResponseDto {
    this.logger.log('Building TRON token transfer from params');
    const adapterRequest: TronTransferBuildAdapterInput = {
      transferType: request.transferType,
      ownerAddress: request.ownerAddress,
      toAddress: request.toAddress,
      amount: request.amount,
      assetName: request.assetName,
      contractAddress: request.contractAddress,
      callValue: request.callValue,
      timestamp: request.timestamp,
      expiration: request.expiration,
      feeLimit: request.feeLimit,
      memo: request.memo,
    };
    return this.tronTransactionAdapter.buildTransfer(adapterRequest);
  }

  /**
   * Signs a TRON transaction from raw JSON.
   * @param request Request payload.
   * @returns Signed transaction response.
   */
  sign(
    request: SignTronRawTransactionRequestDto,
  ): SignTronTransactionResponseDto {
    this.logger.log('Signing TRON transaction');
    const adapterRequest: TronSignRawTransactionAdapterInput = {
      rawJson: request.rawJson,
      privateKey: request.privateKey,
      txId: request.txId,
    };
    const result: SignTronTransactionResponseDto =
      this.tronTransactionAdapter.signTransaction(adapterRequest);
    return result;
  }
}
