import { Injectable, Logger } from '@nestjs/common';
import { TW } from '@trustwallet/wallet-core';
import Long from 'long';
import { resolveTronWalletCoreConfig } from '../tron-wallet-core.config';
import { AdapterError } from '../../../common/errors/adapter-error';
import { WalletCoreAdapter } from '../../../common/wallet-core/wallet-core.adapter';
import { CoinTransactionAdapter } from '../../../common/interfaces/coin-transaction-adapter.interface';
import { TronTransactionBuildAdapterInput } from './dto/tron-transaction-build-input.dto';
import { TronTransactionBuildAdapterOutput } from './dto/tron-transaction-build-output.dto';
import { TronTransferBuildAdapterInput } from './dto/tron-transfer-build-input.dto';
import { TronSignRawTransactionAdapterInput } from './dto/tron-transaction-sign-raw-input.dto';
import { TronSignRawTransactionAdapterOutput } from './dto/tron-transaction-sign-raw-output.dto';

const TRON_CONTRACT_TYPE_URL_PREFIX = 'type.googleapis.com/protocol.';
const TRON_CONTRACT_TYPES: Readonly<Record<string, number>> = {
  TransferContract: 1,
  TransferAssetContract: 2,
  TriggerSmartContract: 31,
};
const RAW_DATA_FIELD_REF_BLOCK_BYTES = 1;
const RAW_DATA_FIELD_REF_BLOCK_HASH = 4;
const RAW_DATA_FIELD_EXPIRATION = 8;
const RAW_DATA_FIELD_DATA = 10;
const RAW_DATA_FIELD_CONTRACT = 11;
const RAW_DATA_FIELD_TIMESTAMP = 14;
const RAW_DATA_FIELD_FEE_LIMIT = 18;
const PROTO_WIRE_VARINT = 0;
const PROTO_WIRE_BYTES = 2;

type TronRawData = {
  ref_block_bytes?: string;
  refBlockBytes?: string;
  ref_block_hash?: string;
  refBlockHash?: string;
  expiration?: string | number;
  timestamp?: string | number;
  fee_limit?: string | number;
  feeLimit?: string | number;
  data?: string;
  contract?: TronRawContract[];
};

type TronRawContract = {
  type?: string;
  parameter?: TronRawParameter;
  permission_id?: string | number;
};

type TronRawParameter = {
  type_url?: string;
  value?: Record<string, unknown>;
};

/**
 * Adapter for TRON transaction build and signing using wallet-core.
 */
@Injectable()
export class TronTransactionAdapter implements CoinTransactionAdapter<
  TronTransactionBuildAdapterInput,
  TronTransactionBuildAdapterOutput,
  TronTransferBuildAdapterInput,
  TronTransactionBuildAdapterOutput
> {
  private readonly logger = new Logger(TronTransactionAdapter.name);

  constructor(private readonly walletCore: WalletCoreAdapter) {}

  /**
   * Builds a TRON transfer payload.
   * @param input Adapter request payload.
   * @returns Unsigned transaction response.
   */
  buildTransfer(
    input: TronTransferBuildAdapterInput,
  ): TronTransactionBuildAdapterOutput {
    this.logger.log('Building TRON token transfer');
    const baseTransaction = this.createBaseTransaction(input);
    let transaction: TW.Tron.Proto.Transaction;
    if (input.transferType === 'trc20') {
      if (!input.contractAddress) {
        throw new AdapterError(
          'TRON_TRC20_CONTRACT_ADDRESS_REQUIRED',
          'TRON TRC20 contract address is required',
        );
      }
      const triggerSmartContract = this.buildTrc20TransferContract(input);
      transaction = TW.Tron.Proto.Transaction.create({
        ...baseTransaction,
        triggerSmartContract,
      });
    } else {
      const transferAsset = TW.Tron.Proto.TransferAssetContract.create({
        ownerAddress: input.ownerAddress,
        toAddress: input.toAddress,
        assetName: input.assetName ?? '',
        amount: this.toLong(input.amount),
      });
      transaction = TW.Tron.Proto.Transaction.create({
        ...baseTransaction,
        transferAsset,
      });
    }
    return {
      rawJson: this.stringifyTransaction(
        transaction,
        input.blockId,
        input.blockNumber,
      ),
    };
  }

  /**
   * Builds a TRON transaction payload.
   * @param input Adapter request payload.
   * @returns Unsigned transaction response.
   */
  buildTransaction(
    input: TronTransactionBuildAdapterInput,
  ): TronTransactionBuildAdapterOutput {
    this.logger.log('Building TRON TRX transaction');
    const baseTransaction = this.createBaseTransaction(input);
    const transfer = TW.Tron.Proto.TransferContract.create({
      ownerAddress: input.ownerAddress,
      toAddress: input.toAddress,
      amount: this.toLong(input.amount),
    });
    const transaction = TW.Tron.Proto.Transaction.create({
      ...baseTransaction,
      transfer,
    });
    return {
      rawJson: this.stringifyTransaction(
        transaction,
        input.blockId,
        input.blockNumber,
      ),
    };
  }

  private stringifyTransaction(
    transaction: TW.Tron.Proto.Transaction,
    blockId: string,
    blockNumber: string,
  ): string {
    const json = transaction.toJSON() as Record<string, unknown>;
    const refBlockBytes = this.deriveRefBlockBytes(blockNumber);
    const refBlockHash = this.deriveRefBlockHash(blockId);
    json.refBlockBytes = refBlockBytes;
    json.refBlockHash = refBlockHash;
    json.ref_block_bytes = refBlockBytes;
    json.ref_block_hash = refBlockHash;
    return JSON.stringify(json);
  }

  private createBaseTransaction(input: {
    timestamp?: string;
    expiration?: string;
    feeLimit?: string;
    memo?: string;
  }): Partial<TW.Tron.Proto.ITransaction> {
    const now = Date.now();
    const timestamp = input.timestamp
      ? this.toLong(input.timestamp)
      : Long.fromNumber(now);
    const expiration = input.expiration
      ? this.toLong(input.expiration)
      : Long.fromNumber(now + 60_000);
    const baseTransaction: Partial<TW.Tron.Proto.ITransaction> = {
      timestamp,
      expiration,
    };
    if (input.feeLimit) {
      baseTransaction.feeLimit = this.toLong(input.feeLimit);
    }
    if (input.memo) {
      baseTransaction.memo = input.memo;
    }
    return baseTransaction;
  }

  /**
   * Signs a TRON transaction payload.
   * @param input Adapter request payload.
   * @returns Signed transaction response.
   */
  signTransaction(
    input: TronSignRawTransactionAdapterInput,
  ): TronSignRawTransactionAdapterOutput {
    const core = this.walletCore.getCore();
    const { coinType } = resolveTronWalletCoreConfig(core);

    try {
      const parsed = this.parseRawJson(input.rawJson);
      const refBlock = this.extractRefBlockFields(parsed);

      if (this.hasRawData(parsed)) {
        return this.signFromRawJson(parsed, input, refBlock, core, coinType);
      }

      const transaction = TW.Tron.Proto.Transaction.fromObject(parsed);

      if (refBlock) {
        const baseSigned = this.signFromTransaction(
          transaction,
          input,
          core,
          coinType,
        );
        const rawObj = this.parseRawJson(baseSigned.signedJson);
        this.applyRefBlockToRawData(rawObj, refBlock);
        return this.signFromRawJson(rawObj, input, refBlock, core, coinType);
      }

      return this.signFromTransaction(transaction, input, core, coinType);
    } catch (error: unknown) {
      if (error instanceof AdapterError) {
        throw error;
      }
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'TRON_TRANSACTION_SIGN_FAILED',
        'TRON transaction signing failed',
        {
          cause,
        },
      );
    }
  }

  private signFromTransaction(
    transaction: TW.Tron.Proto.ITransaction,
    input: TronSignRawTransactionAdapterInput,
    core: ReturnType<WalletCoreAdapter['getCore']>,
    coinType: ReturnType<typeof resolveTronWalletCoreConfig>['coinType'],
  ): TronSignRawTransactionAdapterOutput {
    const signingInput = TW.Tron.Proto.SigningInput.create({
      rawJson: '',
      txId: input.txId ?? '',
      transaction,
      privateKey: core.HexCoding.decode(this.normalizeHex(input.privateKey)),
    });

    const output = this.signWithInput(signingInput, core, coinType);
    const rawDataHex = this.resolveRawDataHex(output.json);
    const signedJson = this.decorateSignedJsonWithRawDataHex(
      output.json,
      rawDataHex,
    );

    return {
      txId: core.HexCoding.encode(output.id),
      signature: core.HexCoding.encode(output.signature),
      refBlockBytes: core.HexCoding.encode(output.refBlockBytes),
      refBlockHash: core.HexCoding.encode(output.refBlockHash),
      rawDataHex,
      signedJson,
      visible: false,
    };
  }

  private signFromRawJson(
    rawObj: Record<string, unknown>,
    input: TronSignRawTransactionAdapterInput,
    refBlock: { bytes: string; hash: string } | null,
    core: ReturnType<WalletCoreAdapter['getCore']>,
    coinType: ReturnType<typeof resolveTronWalletCoreConfig>['coinType'],
  ): TronSignRawTransactionAdapterOutput {
    const rawData = this.getRawData(rawObj);
    if (!rawData) {
      throw new AdapterError(
        'TRON_RAW_JSON_MISSING_FIELD',
        'TRON raw JSON missing raw_data',
      );
    }
    const rawDataHex = this.encodeRawDataHex(rawData);
    const txIdHex = this.buildTxId(rawDataHex, core);
    const normalizedInputTxId = input.txId
      ? this.normalizeHex(input.txId)
      : null;
    if (normalizedInputTxId && normalizedInputTxId !== txIdHex) {
      throw new AdapterError(
        'TRON_TX_ID_MISMATCH',
        'TRON txId does not match raw_data',
        {
          expected: txIdHex,
          provided: normalizedInputTxId,
        },
      );
    }
    rawObj.txID = txIdHex;
    rawObj.raw_data_hex = rawDataHex;
    if ('txId' in rawObj) {
      delete rawObj.txId;
    }
    const rawJson = JSON.stringify(rawObj);
    const signingInput = TW.Tron.Proto.SigningInput.create({
      rawJson,
      txId: txIdHex,
      privateKey: core.HexCoding.decode(this.normalizeHex(input.privateKey)),
    });

    const output = this.signWithInput(signingInput, core, coinType);
    const signatureHex = core.HexCoding.encode(output.signature);
    const signedJson = this.buildSignedJson(rawObj, txIdHex, signatureHex);

    return {
      txId: this.toHexPrefixed(txIdHex),
      signature: signatureHex,
      refBlockBytes: refBlock
        ? this.toHexPrefixed(refBlock.bytes)
        : core.HexCoding.encode(output.refBlockBytes),
      refBlockHash: refBlock
        ? this.toHexPrefixed(refBlock.hash)
        : core.HexCoding.encode(output.refBlockHash),
      rawDataHex,
      signedJson,
      visible: false,
    };
  }

  private signWithInput(
    signingInput: TW.Tron.Proto.SigningInput,
    core: ReturnType<WalletCoreAdapter['getCore']>,
    coinType: ReturnType<typeof resolveTronWalletCoreConfig>['coinType'],
  ): TW.Tron.Proto.SigningOutput {
    const inputBytes = TW.Tron.Proto.SigningInput.encode(signingInput).finish();
    const signedBytes = core.AnySigner.sign(inputBytes, coinType);
    const output = TW.Tron.Proto.SigningOutput.decode(signedBytes);

    if (output.error !== TW.Common.Proto.SigningError.OK) {
      throw new AdapterError(
        'TRON_SIGNING_FAILED',
        output.errorMessage || 'TRON signing failed',
        {
          error: output.error,
          errorMessage: output.errorMessage,
        },
      );
    }

    return output;
  }

  private buildSignedJson(
    rawObj: Record<string, unknown>,
    txIdHex: string,
    signatureHex: string,
  ): string {
    rawObj.txID = this.normalizeHex(txIdHex);
    rawObj.signature = [this.normalizeHex(signatureHex)];
    if ('txId' in rawObj) {
      delete rawObj.txId;
    }
    return JSON.stringify(rawObj);
  }

  private resolveRawDataHex(signedJson: string): string {
    if (!signedJson) {
      return '';
    }
    const parsed = this.parseRawJson(signedJson);
    const rawDataHex = this.getStringField(parsed, 'raw_data_hex');
    if (rawDataHex) {
      return this.normalizeHex(rawDataHex);
    }
    const rawData = this.getRawData(parsed);
    if (!rawData) {
      return '';
    }
    return this.encodeRawDataHex(rawData);
  }

  private decorateSignedJsonWithRawDataHex(
    signedJson: string,
    rawDataHex: string,
  ): string {
    if (!signedJson || !rawDataHex) {
      return signedJson;
    }
    const parsed = this.parseRawJson(signedJson);
    parsed.raw_data_hex = rawDataHex;
    return JSON.stringify(parsed);
  }

  private parseRawJson(rawJson: string): Record<string, unknown> {
    try {
      return JSON.parse(rawJson) as Record<string, unknown>;
    } catch {
      throw new AdapterError(
        'TRON_RAW_JSON_INVALID',
        'TRON raw JSON is invalid',
      );
    }
  }

  private hasRawData(parsed: Record<string, unknown>): boolean {
    return (
      typeof parsed.raw_data === 'object' &&
      parsed.raw_data !== null &&
      !Array.isArray(parsed.raw_data)
    );
  }

  private extractRefBlockFields(
    parsed: Record<string, unknown>,
  ): { bytes: string; hash: string } | null {
    const rawData = this.getRawData(parsed);
    const bytes =
      this.getStringField(parsed, 'refBlockBytes') ??
      this.getStringField(parsed, 'ref_block_bytes') ??
      this.getStringField(rawData, 'ref_block_bytes');
    const hash =
      this.getStringField(parsed, 'refBlockHash') ??
      this.getStringField(parsed, 'ref_block_hash') ??
      this.getStringField(rawData, 'ref_block_hash');

    if (!bytes || !hash) {
      const blockId = this.getStringField(parsed, 'blockId');
      const blockNumber = this.getStringField(parsed, 'blockNumber');
      if (!blockId || !blockNumber) {
        return null;
      }
      return {
        bytes: this.deriveRefBlockBytes(blockNumber),
        hash: this.deriveRefBlockHash(blockId),
      };
    }

    return {
      bytes: this.normalizeHex(bytes),
      hash: this.normalizeHex(hash),
    };
  }

  private applyRefBlockToRawData(
    rawObj: Record<string, unknown>,
    refBlock: { bytes: string; hash: string },
  ): void {
    const rawData = this.getRawData(rawObj);
    if (!rawData) {
      throw new AdapterError(
        'TRON_RAW_JSON_MISSING_FIELD',
        'TRON raw JSON missing raw_data',
      );
    }
    rawData.ref_block_bytes = refBlock.bytes;
    rawData.ref_block_hash = refBlock.hash;
    if ('raw_data_hex' in rawObj) {
      delete rawObj.raw_data_hex;
    }
  }

  private getRawData(
    parsed: Record<string, unknown>,
  ): Record<string, unknown> | null {
    const rawData = parsed.raw_data;
    if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
      return rawData as Record<string, unknown>;
    }
    return null;
  }

  private getStringField(
    source: Record<string, unknown> | null,
    field: string,
  ): string | null {
    if (!source) {
      return null;
    }
    const value = source[field];
    return typeof value === 'string' && value.length > 0 ? value : null;
  }

  private encodeRawDataHex(rawData: Record<string, unknown>): string {
    const typedRawData = rawData as TronRawData;
    const chunks: Uint8Array[] = [];
    const refBlockBytes = this.resolveRequiredBytes(
      typedRawData.ref_block_bytes ?? typedRawData.refBlockBytes,
      'ref_block_bytes',
    );
    chunks.push(
      this.encodeBytesField(RAW_DATA_FIELD_REF_BLOCK_BYTES, refBlockBytes),
    );
    const refBlockHash = this.resolveRequiredBytes(
      typedRawData.ref_block_hash ?? typedRawData.refBlockHash,
      'ref_block_hash',
    );
    chunks.push(
      this.encodeBytesField(RAW_DATA_FIELD_REF_BLOCK_HASH, refBlockHash),
    );
    const expiration = this.resolveRequiredNumeric(
      typedRawData.expiration,
      'expiration',
    );
    chunks.push(this.encodeVarintField(RAW_DATA_FIELD_EXPIRATION, expiration));
    const dataBytes = this.resolveBytesValue(typedRawData.data, 'data');
    if (dataBytes) {
      chunks.push(this.encodeBytesField(RAW_DATA_FIELD_DATA, dataBytes));
    }
    const contracts = this.resolveContractList(typedRawData);
    for (const contract of contracts) {
      chunks.push(
        this.encodeBytesField(
          RAW_DATA_FIELD_CONTRACT,
          this.encodeContract(contract),
        ),
      );
    }
    const timestamp = this.resolveRequiredNumeric(
      typedRawData.timestamp,
      'timestamp',
    );
    chunks.push(this.encodeVarintField(RAW_DATA_FIELD_TIMESTAMP, timestamp));
    const feeLimit = this.resolveNumericValue(
      typedRawData.fee_limit ?? typedRawData.feeLimit,
      'fee_limit',
    );
    if (feeLimit !== null) {
      chunks.push(this.encodeVarintField(RAW_DATA_FIELD_FEE_LIMIT, feeLimit));
    }
    const rawBytes = this.concatBytes(chunks);
    return Buffer.from(rawBytes).toString('hex');
  }

  private buildTxId(
    rawDataHex: string,
    core: ReturnType<WalletCoreAdapter['getCore']>,
  ): string {
    const rawBytes = core.HexCoding.decode(this.normalizeHex(rawDataHex));
    const hashBytes = core.Hash.sha256(rawBytes);
    return this.normalizeHex(core.HexCoding.encode(hashBytes));
  }

  private resolveContractList(rawData: TronRawData): TronRawContract[] {
    const contracts = rawData.contract;
    if (!Array.isArray(contracts) || contracts.length === 0) {
      throw new AdapterError(
        'TRON_RAW_JSON_MISSING_FIELD',
        'TRON raw JSON missing contract',
        {
          field: 'contract',
        },
      );
    }
    const result: TronRawContract[] = [];
    for (const contract of contracts) {
      if (!contract || typeof contract !== 'object') {
        throw new AdapterError(
          'TRON_RAW_JSON_INVALID',
          'TRON raw JSON contract is invalid',
        );
      }
      result.push(contract);
    }
    return result;
  }

  private encodeContract(contract: TronRawContract): Uint8Array {
    const typeName = this.resolveContractTypeName(contract);
    const typeId = TRON_CONTRACT_TYPES[typeName];
    if (!typeId) {
      throw new AdapterError(
        'TRON_CONTRACT_TYPE_UNSUPPORTED',
        'TRON contract type is not supported',
        {
          type: typeName,
        },
      );
    }
    const parameter = this.resolveContractParameter(contract);
    const typeUrl =
      parameter.type_url && parameter.type_url.length > 0
        ? parameter.type_url
        : `${TRON_CONTRACT_TYPE_URL_PREFIX}${typeName}`;
    const value = this.resolveContractValue(parameter);
    const valueBytes = this.encodeContractValue(typeName, value);
    const anyBytes = this.encodeAny(typeUrl, valueBytes);
    const chunks: Uint8Array[] = [
      this.encodeVarintField(1, BigInt(typeId)),
      this.encodeBytesField(2, anyBytes),
    ];
    if (contract.permission_id !== undefined) {
      const permissionId = this.resolveRequiredNumeric(
        contract.permission_id,
        'permission_id',
      );
      chunks.push(this.encodeVarintField(3, permissionId));
    }
    return this.concatBytes(chunks);
  }

  private resolveContractTypeName(contract: TronRawContract): string {
    if (contract.type && contract.type.length > 0) {
      return contract.type;
    }
    const typeUrl = contract.parameter?.type_url;
    if (typeUrl && typeUrl.length > 0) {
      const lastDotIndex = typeUrl.lastIndexOf('.');
      if (lastDotIndex >= 0 && lastDotIndex < typeUrl.length - 1) {
        return typeUrl.slice(lastDotIndex + 1);
      }
    }
    throw new AdapterError(
      'TRON_RAW_JSON_MISSING_FIELD',
      'TRON raw JSON missing contract type',
      {
        field: 'contract.type',
      },
    );
  }

  private resolveContractParameter(
    contract: TronRawContract,
  ): TronRawParameter {
    const parameter = contract.parameter;
    if (!parameter || typeof parameter !== 'object') {
      throw new AdapterError(
        'TRON_RAW_JSON_MISSING_FIELD',
        'TRON raw JSON missing contract parameter',
        {
          field: 'contract.parameter',
        },
      );
    }
    return parameter;
  }

  private resolveContractValue(
    parameter: TronRawParameter,
  ): Record<string, unknown> {
    const value = parameter.value;
    if (!value || typeof value !== 'object') {
      throw new AdapterError(
        'TRON_RAW_JSON_MISSING_FIELD',
        'TRON raw JSON missing contract value',
        {
          field: 'contract.parameter.value',
        },
      );
    }
    return value;
  }

  private encodeContractValue(
    typeName: string,
    value: Record<string, unknown>,
  ): Uint8Array {
    if (typeName === 'TransferContract') {
      return this.encodeTransferContract(value);
    }
    if (typeName === 'TransferAssetContract') {
      return this.encodeTransferAssetContract(value);
    }
    if (typeName === 'TriggerSmartContract') {
      return this.encodeTriggerSmartContract(value);
    }
    throw new AdapterError(
      'TRON_CONTRACT_TYPE_UNSUPPORTED',
      'TRON contract type is not supported',
      {
        type: typeName,
      },
    );
  }

  private encodeTransferContract(value: Record<string, unknown>): Uint8Array {
    const ownerAddress = this.resolveRequiredBytes(
      value.owner_address,
      'owner_address',
    );
    const toAddress = this.resolveRequiredBytes(value.to_address, 'to_address');
    const amount = this.resolveRequiredNumeric(value.amount, 'amount');
    return this.concatBytes([
      this.encodeBytesField(1, ownerAddress),
      this.encodeBytesField(2, toAddress),
      this.encodeVarintField(3, amount),
    ]);
  }

  private encodeTransferAssetContract(
    value: Record<string, unknown>,
  ): Uint8Array {
    const assetName = this.resolveRequiredAssetName(
      value.asset_name,
      'asset_name',
    );
    const ownerAddress = this.resolveRequiredBytes(
      value.owner_address,
      'owner_address',
    );
    const toAddress = this.resolveRequiredBytes(value.to_address, 'to_address');
    const amount = this.resolveRequiredNumeric(value.amount, 'amount');
    return this.concatBytes([
      this.encodeBytesField(1, assetName),
      this.encodeBytesField(2, ownerAddress),
      this.encodeBytesField(3, toAddress),
      this.encodeVarintField(4, amount),
    ]);
  }

  private encodeTriggerSmartContract(
    value: Record<string, unknown>,
  ): Uint8Array {
    const ownerAddress = this.resolveRequiredBytes(
      value.owner_address,
      'owner_address',
    );
    const contractAddress = this.resolveRequiredBytes(
      value.contract_address,
      'contract_address',
    );
    const chunks: Uint8Array[] = [
      this.encodeBytesField(1, ownerAddress),
      this.encodeBytesField(2, contractAddress),
    ];
    if (this.hasObjectField(value, 'call_value')) {
      const callValue = this.resolveRequiredNumeric(
        value.call_value,
        'call_value',
      );
      chunks.push(this.encodeVarintField(3, callValue));
    }
    if (this.hasObjectField(value, 'data')) {
      const dataBytes = this.resolveRequiredBytes(value.data, 'data');
      chunks.push(this.encodeBytesField(4, dataBytes));
    }
    if (this.hasObjectField(value, 'call_token_value')) {
      const callTokenValue = this.resolveRequiredNumeric(
        value.call_token_value,
        'call_token_value',
      );
      chunks.push(this.encodeVarintField(5, callTokenValue));
    }
    if (this.hasObjectField(value, 'token_id')) {
      const tokenId = this.resolveRequiredNumeric(value.token_id, 'token_id');
      chunks.push(this.encodeVarintField(6, tokenId));
    }
    return this.concatBytes(chunks);
  }

  private encodeAny(typeUrl: string, value: Uint8Array): Uint8Array {
    return this.concatBytes([
      this.encodeStringField(1, typeUrl),
      this.encodeBytesField(2, value),
    ]);
  }

  private encodeVarintField(field: number, value: bigint): Uint8Array {
    return this.concatBytes([
      this.encodeTag(field, PROTO_WIRE_VARINT),
      this.encodeVarint(value),
    ]);
  }

  private encodeBytesField(field: number, value: Uint8Array): Uint8Array {
    return this.concatBytes([
      this.encodeTag(field, PROTO_WIRE_BYTES),
      this.encodeVarint(BigInt(value.length)),
      value,
    ]);
  }

  private encodeStringField(field: number, value: string): Uint8Array {
    const bytes = Buffer.from(value, 'utf8');
    return this.encodeBytesField(field, bytes);
  }

  private encodeTag(field: number, wireType: number): Uint8Array {
    return this.encodeVarint(BigInt((field << 3) | wireType));
  }

  private encodeVarint(value: bigint): Uint8Array {
    let target = value;
    if (target < 0n) {
      target = (1n << 64n) + target;
    }
    const bytes: number[] = [];
    while (target >= 0x80n) {
      bytes.push(Number((target & 0x7fn) | 0x80n));
      target >>= 7n;
    }
    bytes.push(Number(target));
    return Uint8Array.from(bytes);
  }

  private concatBytes(chunks: Uint8Array[]): Uint8Array {
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  }

  private resolveRequiredNumeric(value: unknown, field: string): bigint {
    const resolved = this.resolveNumericValue(value, field);
    if (resolved === null) {
      throw new AdapterError(
        'TRON_RAW_JSON_MISSING_FIELD',
        'TRON raw JSON missing numeric field',
        {
          field,
        },
      );
    }
    return resolved;
  }

  private resolveNumericValue(value: unknown, field: string): bigint | null {
    if (value === undefined || value === null) {
      return null;
    }
    if (typeof value === 'bigint') {
      return value;
    }
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        throw new AdapterError(
          'TRON_RAW_JSON_INVALID',
          'TRON raw JSON numeric field is invalid',
          {
            field,
          },
        );
      }
      return BigInt(Math.trunc(value));
    }
    if (typeof value === 'string' && value.length > 0) {
      try {
        return BigInt(value);
      } catch (error: unknown) {
        const cause = error instanceof Error ? error.message : String(error);
        throw new AdapterError(
          'TRON_RAW_JSON_INVALID',
          'TRON raw JSON numeric field is invalid',
          {
            field,
            cause,
          },
        );
      }
    }
    throw new AdapterError(
      'TRON_RAW_JSON_INVALID',
      'TRON raw JSON numeric field is invalid',
      {
        field,
      },
    );
  }

  private resolveRequiredBytes(value: unknown, field: string): Uint8Array {
    const resolved = this.resolveBytesValue(value, field);
    if (!resolved) {
      throw new AdapterError(
        'TRON_RAW_JSON_MISSING_FIELD',
        'TRON raw JSON missing bytes field',
        {
          field,
        },
      );
    }
    return resolved;
  }

  private resolveBytesValue(value: unknown, field: string): Uint8Array | null {
    if (value === undefined || value === null) {
      return null;
    }
    if (value instanceof Uint8Array) {
      return value;
    }
    if (Buffer.isBuffer(value)) {
      return new Uint8Array(value);
    }
    if (Array.isArray(value)) {
      return Uint8Array.from(value.map((item) => Number(item)));
    }
    if (typeof value === 'string') {
      if (this.isHexString(value)) {
        return this.decodeHex(value);
      }
      return new Uint8Array(Buffer.from(value, 'base64'));
    }
    throw new AdapterError(
      'TRON_RAW_JSON_INVALID',
      'TRON raw JSON bytes field is invalid',
      {
        field,
      },
    );
  }

  private resolveRequiredAssetName(value: unknown, field: string): Uint8Array {
    if (value === undefined || value === null) {
      throw new AdapterError(
        'TRON_RAW_JSON_MISSING_FIELD',
        'TRON raw JSON missing asset name',
        {
          field,
        },
      );
    }
    if (value instanceof Uint8Array) {
      return value;
    }
    if (Buffer.isBuffer(value)) {
      return new Uint8Array(value);
    }
    if (Array.isArray(value)) {
      return Uint8Array.from(value.map((item) => Number(item)));
    }
    if (typeof value === 'string') {
      if (this.isHexString(value)) {
        return this.decodeHex(value);
      }
      return new Uint8Array(Buffer.from(value, 'utf8'));
    }
    throw new AdapterError(
      'TRON_RAW_JSON_INVALID',
      'TRON raw JSON asset name is invalid',
      {
        field,
      },
    );
  }

  private hasObjectField(
    value: Record<string, unknown>,
    field: string,
  ): boolean {
    return Object.prototype.hasOwnProperty.call(value, field) === true;
  }

  private isHexString(value: string): boolean {
    const normalized =
      value.startsWith('0x') || value.startsWith('0X') ? value.slice(2) : value;
    return normalized.length > 0 && /^[0-9a-fA-F]+$/.test(normalized);
  }

  private decodeHex(value: string): Uint8Array {
    return new Uint8Array(Buffer.from(this.normalizeHex(value), 'hex'));
  }

  private toHexPrefixed(value: string): string {
    const normalized = this.normalizeHex(value);
    return normalized.length === 0 ? '0x' : `0x${normalized}`;
  }

  private deriveRefBlockBytes(blockNumber: string): string {
    const normalized = this.normalizeNumericHex(blockNumber);
    return normalized.padStart(4, '0').slice(-4);
  }

  private deriveRefBlockHash(blockId: string): string {
    const normalized = this.normalizeHex(blockId);
    if (normalized.length !== 64) {
      throw new AdapterError(
        'TRON_BLOCK_ID_INVALID',
        'TRON block id is invalid',
        { length: normalized.length },
      );
    }
    return normalized.slice(16, 32);
  }

  private buildTrc20TransferContract(
    input: TronTransferBuildAdapterInput,
  ): TW.Tron.Proto.TriggerSmartContract {
    const triggerSmartContract = TW.Tron.Proto.TriggerSmartContract.create({
      ownerAddress: input.ownerAddress,
      contractAddress: input.contractAddress ?? '',
      data: this.encodeTrc20TransferData(input.toAddress, input.amount),
    });

    if (input.callValue) {
      triggerSmartContract.callValue = this.toLong(input.callValue);
    }

    return triggerSmartContract;
  }

  private encodeTrc20TransferData(
    toAddress: string,
    amount: string,
  ): Uint8Array {
    const core = this.walletCore.getCore();
    try {
      const selector = core.Hash.keccak256(
        Buffer.from('transfer(address,uint256)'),
      );
      const selectorBytes = selector.slice(0, 4);
      const addressBytes = this.leftPadBytes(
        this.toTronEvmAddressBytes(toAddress),
        32,
      );
      const amountBytes = this.leftPadBytes(this.toBytes(amount), 32);
      const data = new Uint8Array(4 + 32 + 32);
      data.set(selectorBytes, 0);
      data.set(addressBytes, 4);
      data.set(amountBytes, 36);
      return data;
    } catch (error: unknown) {
      if (error instanceof AdapterError) {
        throw error;
      }
      const cause = error instanceof Error ? error.message : String(error);
      throw new AdapterError(
        'TRON_TRC20_DATA_INVALID',
        'TRON TRC20 transfer data invalid',
        {
          cause,
        },
      );
    }
  }

  private toTronEvmAddressBytes(address: string): Uint8Array {
    const core = this.walletCore.getCore();
    const { coinType } = resolveTronWalletCoreConfig(core);

    if (!core.AnyAddress.isValid(address, coinType)) {
      throw new AdapterError(
        'TRON_ADDRESS_INVALID',
        'TRON address is invalid',
        {
          address,
        },
      );
    }

    const anyAddress = core.AnyAddress.createWithString(address, coinType);
    try {
      const data = anyAddress.data();
      const resolved = data.length === 0 ? core.Base58.decode(address) : data;
      if (resolved.length === 21) {
        return resolved.slice(1);
      }
      if (resolved.length === 20) {
        return resolved;
      }
      throw new AdapterError(
        'TRON_ADDRESS_INVALID',
        'TRON address payload is invalid',
        {
          address,
          length: resolved.length,
        },
      );
    } finally {
      anyAddress.delete();
    }
  }

  private toBytes(value: string): Uint8Array {
    const core = this.walletCore.getCore();
    const normalized = this.normalizeNumericHex(value);
    const even = normalized.length % 2 === 0 ? normalized : `0${normalized}`;
    return core.HexCoding.decode(even);
  }

  private leftPadBytes(value: Uint8Array, length: number): Uint8Array {
    if (value.length > length) {
      throw new AdapterError(
        'TRON_TRC20_VALUE_TOO_LARGE',
        'TRON TRC20 value exceeds 32 bytes',
        { length: value.length },
      );
    }
    const padded = new Uint8Array(length);
    padded.set(value, length - value.length);
    return padded;
  }

  private normalizeNumericHex(value: string): string {
    if (value.startsWith('0x') || value.startsWith('0X')) {
      return value.slice(2);
    }
    const asBigInt = BigInt(value);
    return asBigInt.toString(16);
  }

  private toLong(value: string): Long {
    if (value.startsWith('0x') || value.startsWith('0X')) {
      const normalized = value.slice(2);
      if (normalized.length === 0) {
        return Long.fromString('0');
      }
      const asBigInt = BigInt(`0x${normalized}`);
      return Long.fromString(asBigInt.toString());
    }
    return Long.fromString(value);
  }

  private normalizeHex(value: string): string {
    const stripped =
      value.startsWith('0x') || value.startsWith('0X') ? value.slice(2) : value;
    if (stripped.length % 2 === 1) {
      return `0${stripped}`;
    }
    return stripped;
  }
}
