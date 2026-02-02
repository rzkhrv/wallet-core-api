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
import { AdapterError } from '../../../common/errors/adapter-error';
import { WalletCoreAdapter } from '../../../common/wallet-core/wallet-core.adapter';

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
    private readonly walletCore: WalletCoreAdapter,
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
      blockId: request.blockId,
      blockNumber: request.blockNumber,
      timestamp: request.timestamp,
      expiration: request.expiration,
      feeLimit: request.feeLimit,
      memo: request.memo,
    };
    const result = this.tronTransactionAdapter.buildTransaction(adapterRequest);
    return this.buildResponseFromRawJson(result.rawJson);
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
      blockId: request.blockId,
      blockNumber: request.blockNumber,
      assetName: request.assetName,
      contractAddress: request.contractAddress,
      callValue: request.callValue,
      timestamp: request.timestamp,
      expiration: request.expiration,
      feeLimit: request.feeLimit,
      memo: request.memo,
    };
    const result = this.tronTransactionAdapter.buildTransfer(adapterRequest);
    return this.buildResponseFromRawJson(result.rawJson);
  }

  /**
   * Signs a TRON transaction from build payload.
   * @param request Request payload.
   * @returns Signed transaction response.
   */
  sign(
    request: SignTronRawTransactionRequestDto,
  ): SignTronTransactionResponseDto {
    this.logger.log('Signing TRON transaction');
    const rawJson = this.decodePayload(request.payload);
    const adapterRequest: TronSignRawTransactionAdapterInput = {
      rawJson,
      privateKey: request.privateKey,
      txId: request.txId,
    };
    const result: SignTronTransactionResponseDto =
      this.tronTransactionAdapter.signTransaction(adapterRequest);
    return result;
  }

  private parseRawJson(rawJson: string): {
    transfer?: Record<string, unknown>;
    transferAsset?: Record<string, unknown>;
    triggerSmartContract?: Record<string, unknown>;
    timestamp?: string | number;
    expiration?: string | number;
    feeLimit?: string | number;
    memo?: string;
  } {
    try {
      return JSON.parse(rawJson) as {
        transfer?: Record<string, unknown>;
        transferAsset?: Record<string, unknown>;
        triggerSmartContract?: Record<string, unknown>;
        timestamp?: string | number;
        expiration?: string | number;
        feeLimit?: string | number;
        memo?: string;
      };
    } catch {
      throw new AdapterError(
        'TRON_RAW_JSON_INVALID',
        'TRON raw JSON is invalid',
      );
    }
  }

  private normalizeNumeric(value: string | number): string {
    return BigInt(String(value)).toString(10);
  }

  private normalizeOptionalNumeric(value?: string | number): string | null {
    if (value === undefined || value === null) {
      return null;
    }
    return this.normalizeNumeric(value);
  }

  private requireNumeric(value: unknown, field: string): string {
    if (value === undefined || value === null) {
      throw new AdapterError(
        'TRON_RAW_JSON_MISSING_FIELD',
        `TRON raw JSON missing ${field}`,
        { field },
      );
    }
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new AdapterError(
        'TRON_RAW_JSON_INVALID',
        `TRON raw JSON has invalid ${field}`,
        { field },
      );
    }
    return this.normalizeNumeric(value);
  }

  private buildResponseFromRawJson(
    rawJson: string,
  ): BuildTronTransactionResponseDto {
    const parsed = this.parseRawJson(rawJson);
    const transfer = parsed.transfer;
    const transferAsset = parsed.transferAsset;
    const triggerSmartContract = parsed.triggerSmartContract;

    if (transfer) {
      return {
        payload: this.encodePayload(rawJson),
        transaction: {
          type: 'trx',
          ownerAddress: this.requireString(
            transfer.ownerAddress,
            'ownerAddress',
          ),
          toAddress: this.requireString(transfer.toAddress, 'toAddress'),
          amount: this.requireNumeric(transfer.amount, 'amount'),
          timestamp: this.requireNumeric(parsed.timestamp, 'timestamp'),
          expiration: this.requireNumeric(parsed.expiration, 'expiration'),
          feeLimit: this.normalizeOptionalNumeric(parsed.feeLimit),
          memo: this.normalizeMemo(parsed.memo),
        },
      };
    }

    if (transferAsset) {
      return {
        payload: this.encodePayload(rawJson),
        transaction: {
          type: 'trc10',
          ownerAddress: this.requireString(
            transferAsset.ownerAddress,
            'ownerAddress',
          ),
          toAddress: this.requireString(transferAsset.toAddress, 'toAddress'),
          amount: this.requireNumeric(transferAsset.amount, 'amount'),
          assetName: this.requireString(transferAsset.assetName, 'assetName'),
          timestamp: this.requireNumeric(parsed.timestamp, 'timestamp'),
          expiration: this.requireNumeric(parsed.expiration, 'expiration'),
          feeLimit: this.normalizeOptionalNumeric(parsed.feeLimit),
          memo: this.normalizeMemo(parsed.memo),
        },
      };
    }

    if (triggerSmartContract) {
      const details = this.decodeTrc20Transfer(triggerSmartContract.data);
      return {
        payload: this.encodePayload(rawJson),
        transaction: {
          type: 'trc20',
          ownerAddress: this.requireString(
            triggerSmartContract.ownerAddress,
            'ownerAddress',
          ),
          toAddress: details.toAddress,
          amount: details.amount,
          contractAddress: this.requireString(
            triggerSmartContract.contractAddress,
            'contractAddress',
          ),
          callValue: this.requireNumeric(
            triggerSmartContract.callValue ?? '0',
            'callValue',
          ),
          timestamp: this.requireNumeric(parsed.timestamp, 'timestamp'),
          expiration: this.requireNumeric(parsed.expiration, 'expiration'),
          feeLimit: this.normalizeOptionalNumeric(parsed.feeLimit),
          memo: this.normalizeMemo(parsed.memo),
        },
      };
    }

    throw new AdapterError(
      'TRON_RAW_JSON_MISSING_FIELD',
      'TRON raw JSON missing contract data',
    );
  }

  private decodeTrc20Transfer(data: unknown): {
    toAddress: string;
    amount: string;
  } {
    const buffer = this.toDataBuffer(data);
    if (buffer.length < 4 + 32 + 32) {
      throw new AdapterError(
        'TRON_RAW_JSON_MISSING_FIELD',
        'TRON TRC20 data missing transfer payload',
      );
    }

    const selector = buffer.subarray(0, 4).toString('hex');
    if (selector !== 'a9059cbb') {
      throw new AdapterError(
        'TRON_RAW_JSON_INVALID',
        'TRON TRC20 data has unexpected selector',
      );
    }

    const addressWord = buffer.subarray(4, 4 + 32);
    const addressBytes = addressWord.subarray(12);
    if (addressBytes.length !== 20) {
      throw new AdapterError(
        'TRON_RAW_JSON_INVALID',
        'TRON TRC20 data has invalid address length',
      );
    }

    const amountBytes = buffer.subarray(4 + 32, 4 + 64);
    const amountHex = amountBytes.toString('hex');
    const safeHex = amountHex.length === 0 ? '0' : amountHex;

    return {
      toAddress: this.toTronBase58Address(addressBytes),
      amount: BigInt(`0x${safeHex}`).toString(10),
    };
  }

  private toDataBuffer(data: unknown): Buffer {
    if (Array.isArray(data)) {
      return Buffer.from(data);
    }
    if (typeof data === 'string') {
      return Buffer.from(data, 'base64');
    }
    return Buffer.from([]);
  }

  private toTronBase58Address(address: Uint8Array): string {
    const core = this.walletCore.getCore();
    const prefixed = new Uint8Array(21);
    prefixed[0] = 0x41;
    prefixed.set(address, 1);
    return core.Base58.encode(prefixed);
  }

  private requireString(value: unknown, field: string): string {
    if (typeof value !== 'string' || value.length === 0) {
      throw new AdapterError(
        'TRON_RAW_JSON_MISSING_FIELD',
        `TRON raw JSON missing ${field}`,
        { field },
      );
    }
    return value;
  }

  private normalizeMemo(value?: string): string | null {
    if (typeof value !== 'string') {
      return null;
    }
    return value;
  }

  private encodePayload(rawJson: string): string {
    const core = this.walletCore.getCore();
    const bytes = Buffer.from(rawJson, 'utf8');
    return core.HexCoding.encode(bytes);
  }

  private decodePayload(payload: string): string {
    const core = this.walletCore.getCore();
    try {
      const normalized = this.normalizeHexBytes(payload);
      const bytes = core.HexCoding.decode(normalized);
      return Buffer.from(bytes).toString('utf8');
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'TRON_PAYLOAD_INVALID',
        'TRON payload is invalid',
        { cause },
      );
    }
  }

  private normalizeHex(value: string): string {
    return value.startsWith('0x') || value.startsWith('0X')
      ? value.slice(2)
      : value;
  }

  private normalizeHexBytes(value: string): string {
    const normalized = this.normalizeHex(value);
    if (normalized.length === 0) {
      return normalized;
    }
    return normalized.length % 2 === 0 ? normalized : `0${normalized}`;
  }
}
