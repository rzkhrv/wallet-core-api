import { Injectable, Logger } from '@nestjs/common';
import { TronTransactionBuildAdapterInput } from '../adapter/dto/tron-transaction-build-input.dto';
import { TronTransferBuildAdapterInput } from '../adapter/dto/tron-transfer-build-input.dto';
import { TronTransactionSignAdapterInput } from '../adapter/dto/tron-transaction-sign-input.dto';
import { TronTransactionAdapter } from '../adapter/tron-transaction.adapter';
import { CoinTransactionService } from '../../../common/interfaces/coin-transaction-service.interface';
import { BuildTronTransactionRequestDto } from '../dto/request/build-tron-transaction.request.dto';
import { BuildTronTransferRequestDto } from '../dto/request/build-tron-transfer.request.dto';
import { SignTronTransactionRequestDto } from '../dto/request/sign-tron-transaction.request.dto';
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
    const timestamp = this.resolveTimestamp(request.timestamp);
    const expiration = this.resolveExpiration(request.expiration, timestamp);
    const adapterRequest: TronTransactionBuildAdapterInput = {
      ownerAddress: request.ownerAddress,
      toAddress: request.toAddress,
      amount: request.amount,
      blockId: request.blockId,
      blockNumber: request.blockNumber,
      timestamp,
      expiration,
      feeLimit: request.feeLimit,
      memo: request.memo,
    };
    const result = this.tronTransactionAdapter.buildTransaction(adapterRequest);
    return {
      payload: result.payload,
      transaction: result.transaction,
    };
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
    const timestamp = this.resolveTimestamp(request.timestamp);
    const expiration = this.resolveExpiration(request.expiration, timestamp);
    const adapterRequest: TronTransferBuildAdapterInput = {
      ownerAddress: request.ownerAddress,
      toAddress: request.toAddress,
      amount: request.amount,
      blockId: request.blockId,
      blockNumber: request.blockNumber,
      contractAddress: request.contractAddress,
      callValue: request.callValue,
      timestamp: timestamp,
      expiration: expiration,
      feeLimit: request.feeLimit,
      memo: request.memo,
    };
    const result = this.tronTransactionAdapter.buildTransfer(adapterRequest);
    return {
      payload: result.payload,
      transaction: result.transaction,
    };
  }

  /**
   * Signs a TRON transaction from build payload.
   * @param request Request payload.
   * @returns Signed transaction response.
   */
  sign(request: SignTronTransactionRequestDto): SignTronTransactionResponseDto {
    this.logger.log('Signing TRON transaction');
    const adapterRequest: TronTransactionSignAdapterInput = {
      payload: request.payload,
      privateKey: request.privateKey,
      txId: request.txId,
    };
    return this.tronTransactionAdapter.signTransaction(adapterRequest);
  }

  private resolveTimestamp(value?: string): string {
    return value ?? `${Date.now()}`;
  }

  private resolveExpiration(value?: string, timestamp?: string): string {
    if (value) {
      return value;
    }
    const base = timestamp ? BigInt(timestamp) : BigInt(Date.now());
    return (base + 60_000n).toString();
  }
}
