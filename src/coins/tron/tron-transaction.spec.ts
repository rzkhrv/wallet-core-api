import { createHash } from 'crypto';
import type { WalletCore } from '@trustwallet/wallet-core';
import { TronTransactionAdapter } from './adapter/tron-transaction.adapter';
import { WalletCoreAdapter } from '../../common/wallet-core/wallet-core.adapter';
import { AdapterError } from '../../common/errors/adapter-error';

const resolveTrc20Amount = (rawJson: string): bigint => {
  const parsed: Record<string, unknown> = JSON.parse(rawJson) as Record<
    string,
    unknown
  >;
  const triggerSmartContract: Record<string, unknown> | undefined =
    parsed.triggerSmartContract as Record<string, unknown> | undefined;
  const dataValue: unknown = triggerSmartContract?.data;
  const emptyBuffer: Buffer = Buffer.from([]);
  const dataBuffer: Buffer = Array.isArray(dataValue)
    ? Buffer.from(dataValue)
    : typeof dataValue === 'string'
      ? Buffer.from(dataValue, 'base64')
      : emptyBuffer;
  const sliceStart: number =
    dataBuffer.length >= 32 ? dataBuffer.length - 32 : 0;
  const amountBuffer: Buffer = dataBuffer.slice(sliceStart);
  const amountHex: string = amountBuffer.toString('hex');
  const safeHex: string = amountHex.length === 0 ? '0' : amountHex;
  const amount: bigint = BigInt(`0x${safeHex}`);
  return amount;
};

const normalizeHex = (value: string): string =>
  value.startsWith('0x') || value.startsWith('0X') ? value.slice(2) : value;

const hashRawDataHex = (rawDataHex: string): string =>
  createHash('sha256')
    .update(Buffer.from(normalizeHex(rawDataHex), 'hex'))
    .digest('hex');

describe('TRON transaction build/signing', () => {
  let walletCore: WalletCoreAdapter;
  let transactionAdapter: TronTransactionAdapter;

  beforeAll(async () => {
    walletCore = new WalletCoreAdapter();
    await walletCore.onModuleInit();
    transactionAdapter = new TronTransactionAdapter(walletCore);
  });

  it('builds TRON TRX transaction without signing (adapter)', () => {
    const core = walletCore.getCore();
    const wallet = core.HDWallet.create(128, '');
    const ownerAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const recipientAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const privateKey = core.HexCoding.encode(
      wallet.getKeyForCoin(core.CoinType.tron).data(),
    );
    const blockId = '11'.repeat(32);
    const blockNumber = '0x1234';

    const now = Date.now();
    const result = transactionAdapter.buildTransaction({
      ownerAddress,
      toAddress: recipientAddress,
      amount: '1',
      blockId,
      blockNumber,
      timestamp: `${now}`,
      expiration: `${now + 60_000}`,
    });

    expect(result.rawJson).toBeDefined();
    const parsed = JSON.parse(result.rawJson) as {
      transfer?: unknown;
      refBlockBytes?: string;
      refBlockHash?: string;
    };
    expect(parsed.transfer).toBeDefined();
    expect(parsed.refBlockBytes).toBe('1234');
    expect(parsed.refBlockHash).toBe('11'.repeat(8));

    const signed = transactionAdapter.signTransaction({
      rawJson: result.rawJson,
      privateKey,
    });

    expect(signed.txId).toBeDefined();
    expect(signed.signature).toBeDefined();
    expect(signed.rawDataHex).toBeDefined();
    expect(signed.signedJson).toBeDefined();
    const signedJson = JSON.parse(signed.signedJson) as {
      raw_data?: { ref_block_bytes?: string; ref_block_hash?: string };
      raw_data_hex?: string;
    };
    expect(signedJson.raw_data?.ref_block_bytes).toBe('1234');
    expect(signedJson.raw_data?.ref_block_hash).toBe('11'.repeat(8));
    expect(signedJson.raw_data_hex).toBe(signed.rawDataHex);
    const computedTxId = hashRawDataHex(signed.rawDataHex);
    expect(normalizeHex(signed.txId)).toBe(computedTxId);

    wallet.delete();
  });

  it('builds TRC20 transfer without signing (adapter)', () => {
    const core = walletCore.getCore();
    const wallet = core.HDWallet.create(128, '');
    const ownerAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const recipientAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const contractAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const privateKey = core.HexCoding.encode(
      wallet.getKeyForCoin(core.CoinType.tron).data(),
    );
    const blockId = '11'.repeat(32);
    const blockNumber = '0x1234';

    const result = transactionAdapter.buildTransfer({
      transferType: 'trc20',
      ownerAddress,
      toAddress: recipientAddress,
      contractAddress,
      amount: '1',
      blockId,
      blockNumber,
      feeLimit: '10000000',
      callValue: '0',
    });

    expect(result.rawJson).toBeDefined();
    const parsed = JSON.parse(result.rawJson) as {
      triggerSmartContract?: { data?: string | number[] };
    };
    expect(parsed.triggerSmartContract).toBeDefined();
    const data = parsed.triggerSmartContract?.data;
    expect(data).toBeDefined();
    if (!data) {
      throw new Error('TRC20 transfer data missing');
    }
    const dataBuffer = Array.isArray(data)
      ? Buffer.from(data)
      : Buffer.from(data, 'base64');
    const dataHex = dataBuffer.toString('hex');
    expect(dataHex.startsWith('a9059cbb')).toBe(true);

    const signed = transactionAdapter.signTransaction({
      rawJson: result.rawJson,
      privateKey,
    });

    expect(signed.txId).toBeDefined();
    expect(signed.signature).toBeDefined();
    expect(signed.rawDataHex).toBeDefined();
    expect(signed.signedJson).toBeDefined();
    const signedJson = JSON.parse(signed.signedJson) as {
      raw_data?: { ref_block_bytes?: string; ref_block_hash?: string };
      raw_data_hex?: string;
    };
    expect(signedJson.raw_data?.ref_block_bytes).toBe('1234');
    expect(signedJson.raw_data?.ref_block_hash).toBe('11'.repeat(8));
    expect(signedJson.raw_data_hex).toBe(signed.rawDataHex);
    const computedTxId = hashRawDataHex(signed.rawDataHex);
    expect(normalizeHex(signed.txId)).toBe(computedTxId);

    wallet.delete();
  });

  it('parses decimal and hex amounts in TRC20 transfer data (adapter)', () => {
    const core = walletCore.getCore();
    const wallet = core.HDWallet.create(128, '');
    const ownerAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const recipientAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const contractAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const decimalRawJson: string = transactionAdapter.buildTransfer({
      transferType: 'trc20',
      ownerAddress,
      toAddress: recipientAddress,
      contractAddress,
      amount: '10',
      blockId: '11'.repeat(32),
      blockNumber: '0x1234',
      feeLimit: '10000000',
      callValue: '0',
    }).rawJson;
    const decimalAmount: bigint = resolveTrc20Amount(decimalRawJson);
    expect(decimalAmount).toBe(10n);
    const hexRawJson: string = transactionAdapter.buildTransfer({
      transferType: 'trc20',
      ownerAddress,
      toAddress: recipientAddress,
      contractAddress,
      amount: '0x10',
      blockId: '11'.repeat(32),
      blockNumber: '0x1234',
      feeLimit: '10000000',
      callValue: '0',
    }).rawJson;
    const hexAmount: bigint = resolveTrc20Amount(hexRawJson);
    expect(hexAmount).toBe(16n);
    wallet.delete();
  });

  it('throws when rawJson is invalid', () => {
    expect(() =>
      transactionAdapter.signTransaction({
        rawJson: '{invalid',
        privateKey: '00'.repeat(32),
      }),
    ).toThrow(AdapterError);
  });

  it('accepts 20 and 21 byte TRON address payloads (adapter)', () => {
    const address20: string = 'address-20';
    const address21: string = 'address-21';
    const payload21: Uint8Array = Uint8Array.from([
      0x41,
      ...Array.from({ length: 20 }, () => 0x22),
    ]);
    const payload20: Uint8Array = Uint8Array.from(
      Array.from({ length: 20 }, () => 0x11),
    );
    const fakeCore: WalletCore = {
      CoinType: { tron: { value: 0 } } as WalletCore['CoinType'],
      Purpose: { bip44: {} } as WalletCore['Purpose'],
      Derivation: { default: {} } as WalletCore['Derivation'],
      AnyAddress: {
        isValid: jest.fn().mockReturnValue(true),
        createWithString: jest.fn((address: string) => ({
          data: () => (address === address21 ? payload21 : payload20),
          delete: () => undefined,
        })),
      },
    } as unknown as WalletCore;
    const fakeWalletCore: WalletCoreAdapter = {
      getCore: () => fakeCore,
    } as WalletCoreAdapter;
    const adapter: TronTransactionAdapter = new TronTransactionAdapter(
      fakeWalletCore,
    );
    const adapterInternal: {
      toTronEvmAddressBytes: (address: string) => Uint8Array;
    } = adapter as unknown as {
      toTronEvmAddressBytes: (address: string) => Uint8Array;
    };
    const result21: Uint8Array =
      adapterInternal.toTronEvmAddressBytes(address21);
    const result20: Uint8Array =
      adapterInternal.toTronEvmAddressBytes(address20);
    expect(result21).toEqual(payload21.slice(1));
    expect(result20).toEqual(payload20);
  });
});
