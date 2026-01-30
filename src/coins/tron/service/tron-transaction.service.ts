import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TronBuildTransactionAdapterResponse } from '../../../adapter/coins/tron/dto/tron-transaction-build.dto';
import { TronBuildTransferAdapterRequest } from '../../../adapter/coins/tron/dto/tron-transaction-build-transfer.dto';
import { TronSignRawTransactionAdapterRequest } from '../../../adapter/coins/tron/dto/tron-transaction-sign-raw.dto';
import { TronTransactionAdapter } from '../../../adapter/coins/tron/tron-transaction.adapter';
import { CoinTransactionService } from '../../contracts/coin-service.contracts';
import { BuildTronTransactionRequestDto } from '../dto/request/build-tron-transaction.request.dto';
import { TronTransferType } from '../dto/request/build-tron-transaction.request.dto';
import { SignTronRawTransactionRequestDto } from '../dto/request/sign-tron-raw-transaction.request.dto';
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
    this.logger.log('Building TRON transaction from params');
    const adapterRequest: TronBuildTransferAdapterRequest = {
      transferType: request.transferType ?? TronTransferType.TRX,
      ownerAddress: request.ownerAddress,
      toAddress: request.toAddress,
      amount: request.amount,
      assetName: request.assetName,
      timestamp: request.timestamp,
      expiration: request.expiration,
      feeLimit: request.feeLimit,
      memo: request.memo,
      privateKey: request.privateKey,
    };

    const result: TronBuildTransactionAdapterResponse =
      this.tronTransactionAdapter.buildTransfer(adapterRequest);

    return result;
  }

  buildTransfer(
    request: BuildTronTransactionRequestDto,
  ): BuildTronTransactionResponseDto {
    this.logger.log('Building TRON transfer from params');
    return this.buildTransaction({
      ...request,
      transferType: TronTransferType.TRX,
    });
  }

  signRawTransaction(
    request: SignTronRawTransactionRequestDto,
  ): BuildTronTransactionResponseDto {
    this.logger.log('Signing TRON raw transaction');
    const adapterRequest: TronSignRawTransactionAdapterRequest = {
      rawJson: request.rawJson,
      privateKey: request.privateKey,
      txId: request.txId,
    };

    const result: TronBuildTransactionAdapterResponse =
      this.tronTransactionAdapter.buildTransaction(adapterRequest);

    return result;
  }

  signRawTransfer(
    request: SignTronRawTransactionRequestDto,
  ): BuildTronTransactionResponseDto {
    this.logger.log('Signing TRON raw transfer');
    this.ensureTransferContract(request.rawJson);
    return this.signRawTransaction(request);
  }

  private ensureTransferContract(rawJson: string): void {
    const type = this.resolveContractType(rawJson);
    if (!type || !this.isTransferContractType(type)) {
      throw new BadRequestException(
        `TRON transfer transaction expected, got ${type ?? 'unknown'}`,
      );
    }
  }

  private resolveContractType(rawJson: string): string | undefined {
    try {
      const parsed = JSON.parse(rawJson) as {
        raw_data?: { contract?: Array<{ type?: string; parameter?: any }> };
      };
      const contract = parsed?.raw_data?.contract?.[0];
      if (!contract) return undefined;
      if (typeof contract.type === 'string') {
        return this.normalizeContractType(contract.type);
      }
      const parameter = contract.parameter;
      if (typeof parameter?.type === 'string') {
        return this.normalizeContractType(parameter.type);
      }
      if (typeof parameter?.type_url === 'string') {
        return this.normalizeContractType(parameter.type_url);
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  private normalizeContractType(value: string): string {
    const bySlash = value.split('/').pop() ?? value;
    const byDot = bySlash.split('.').pop() ?? bySlash;
    return byDot;
  }

  private isTransferContractType(type: string): boolean {
    return type === 'TransferContract' || type === 'TransferAssetContract';
  }
}
