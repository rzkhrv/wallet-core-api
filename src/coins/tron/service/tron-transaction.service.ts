import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import {TronBuildTransactionAdapterResponse} from '../../../adapter/coins/tron/dto/tron-transaction-build-response.dto';
import {TronBuildTransferAdapterRequest} from '../../../adapter/coins/tron/dto/tron-transaction-build-transfer.dto';
import {TronSignRawTransactionAdapterRequest} from '../../../adapter/coins/tron/dto/tron-transaction-sign-raw.dto';
import {TronTransactionAdapter} from '../../../adapter/coins/tron/tron-transaction.adapter';
import {CoinTransactionService} from '../../contracts/coin-transaction-service.interface';
import {BuildTronTransactionRequestDto, TronTransferType} from '../dto/request/build-tron-transaction.request.dto';
import {SignTronRawTransactionRequestDto} from '../dto/request/sign-tron-raw-transaction.request.dto';
import {BuildTronTransactionResponseDto} from '../dto/response/build-tron-transaction.response.dto';
import {SignTronTransactionResponseDto} from '../dto/response/sign-tron-transaction.response.dto';

/**
 * Provides TRON transaction build and signing operations.
 */
@Injectable()
export class TronTransactionService implements CoinTransactionService<
  BuildTronTransactionRequestDto,
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
    this.logger.log('Building TRON transaction from params');

    const adapterRequest: TronBuildTransferAdapterRequest = {
      transferType: request.transferType ?? TronTransferType.TRX,
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

    return this.tronTransactionAdapter.buildTransaction(adapterRequest);
  }

  /**
   * Builds a TRON transfer from request data.
   * @param request Request payload.
   * @returns Unsigned transaction response.
   */
  buildTransfer(
    request: BuildTronTransactionRequestDto,
  ): BuildTronTransactionResponseDto {
    this.logger.log('Building TRON transfer from params');
    return this.buildTransaction({
      ...request,
      transferType: TronTransferType.TRX,
    });
  }

  /**
   * Signs a TRON transaction from raw JSON.
   * @param request Request payload.
   * @returns Signed transaction response.
   */
  signRawTransaction(
    request: SignTronRawTransactionRequestDto,
  ): SignTronTransactionResponseDto {
    this.logger.log('Signing TRON raw transaction');
    const adapterRequest: TronSignRawTransactionAdapterRequest = {
      rawJson: request.rawJson,
      privateKey: request.privateKey,
      txId: request.txId,
    };

    const result: SignTronTransactionResponseDto =
      this.tronTransactionAdapter.signTransaction(adapterRequest);

    return result;
  }

  /**
   * Signs a TRON transfer from raw JSON.
   * @param request Request payload.
   * @returns Signed transaction response.
   */
  signRawTransfer(
    request: SignTronRawTransactionRequestDto,
  ): SignTronTransactionResponseDto {
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
      const parsed: unknown = JSON.parse(rawJson);
      if (!this.isRecord(parsed)) {
        return undefined;
      }
      if (this.getRecord(parsed, 'transfer')) {
        return 'TransferContract';
      }
      if (this.getRecord(parsed, 'transferAsset')) {
        return 'TransferAssetContract';
      }
      const rawData = this.getRecord(parsed, 'raw_data');
      const contract = this.getFirstContract(rawData);
      if (!contract) return undefined;
      const contractType = this.getString(contract, 'type');
      if (contractType) {
        return this.normalizeContractType(contractType);
      }
      const parameter = this.getRecord(contract, 'parameter');
      const paramType = this.getString(parameter, 'type');
      if (paramType) {
        return this.normalizeContractType(paramType);
      }
      const paramTypeUrl = this.getString(parameter, 'type_url');
      if (paramTypeUrl) {
        return this.normalizeContractType(paramTypeUrl);
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

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private getRecord(
    value: Record<string, unknown>,
    key: string,
  ): Record<string, unknown> | undefined {
    const candidate = value[key];
    if (!this.isRecord(candidate)) {
      return undefined;
    }
    return candidate;
  }

  private getString(
    value: Record<string, unknown> | undefined,
    key: string,
  ): string | undefined {
    if (!value) {
      return undefined;
    }
    const candidate = value[key];
    if (typeof candidate !== 'string') {
      return undefined;
    }
    return candidate;
  }

  private getFirstContract(
    rawData: Record<string, unknown> | undefined,
  ): Record<string, unknown> | undefined {
    if (!rawData) {
      return undefined;
    }
    const contractValue = rawData.contract;
    if (!Array.isArray(contractValue)) {
      return undefined;
    }
    const first = contractValue[0];
    if (!this.isRecord(first)) {
      return undefined;
    }
    return first;
  }
}
