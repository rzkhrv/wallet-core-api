import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
    return this.signRawTransaction(request);
  }

  buildTransfer(
    request: BuildTronTransactionRequestDto,
  ): BuildTronTransactionResponseDto {
    this.logger.log('Building TRON transfer from rawJson');
    this.ensureNotSmartContract(request.rawJson);
    return this.signRawTransaction(request);
  }

  buildSmartContract(
    request: BuildTronTransactionRequestDto,
  ): BuildTronTransactionResponseDto {
    this.logger.log('Building TRON smart contract from rawJson');
    this.ensureSmartContract(request.rawJson);
    return this.signRawTransaction(request);
  }

  private signRawTransaction(
    request: BuildTronTransactionRequestDto,
  ): BuildTronTransactionResponseDto {
    const adapterRequest: TronBuildTransactionAdapterRequest = {
      rawJson: request.rawJson,
      privateKey: request.privateKey,
      txId: request.txId,
    };

    const result: TronBuildTransactionAdapterResponse =
      this.tronTransactionAdapter.buildTransaction(adapterRequest);

    return result;
  }

  private ensureSmartContract(rawJson: string): void {
    const type = this.resolveContractType(rawJson);
    if (!type || !type.includes('TriggerSmartContract')) {
      throw new BadRequestException(
        'TRON smart contract transaction expected',
      );
    }
  }

  private ensureNotSmartContract(rawJson: string): void {
    const type = this.resolveContractType(rawJson);
    if (type && type.includes('TriggerSmartContract')) {
      throw new BadRequestException(
        'TRON transfer transaction expected',
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
      if (typeof contract.type === 'string') return contract.type;
      const parameter = contract.parameter;
      if (typeof parameter?.type === 'string') return parameter.type;
      if (typeof parameter?.type_url === 'string') return parameter.type_url;
      return undefined;
    } catch {
      return undefined;
    }
  }
}
