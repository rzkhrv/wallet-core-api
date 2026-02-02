import Long from 'long';
import { TronTransactionAdapter } from './adapter/tron-transaction.adapter';
import { WalletCoreAdapter } from '../../common/wallet-core/wallet-core.adapter';
import { AdapterError } from '../../common/errors/adapter-error';
import { TW } from '@trustwallet/wallet-core';

describe('TRON transaction build/signing', () => {
  let walletCore: WalletCoreAdapter;
  let transactionAdapter: TronTransactionAdapter;

  const decodeSigningInput = (payload: string): TW.Tron.Proto.SigningInput => {
    const core = walletCore.getCore();
    const normalized = payload.startsWith('0x') ? payload.slice(2) : payload;
    const bytes = core.HexCoding.decode(normalized);
    return TW.Tron.Proto.SigningInput.decode(bytes);
  };

  const bytesToDecimal = (bytes: Uint8Array): string => {
    if (bytes.length === 0) {
      return '0';
    }
    const core = walletCore.getCore();
    const hex = core.HexCoding.encode(bytes).replace(/^0x/, '');
    const safeHex = hex.length === 0 ? '0' : hex;
    return BigInt(`0x${safeHex}`).toString(10);
  };

  const makeBlockHeader = (number: string) => ({
    number,
    parentHash: '11'.repeat(32),
    txTrieRoot: '22'.repeat(32),
    witnessAddress: `41${'aa'.repeat(20)}`,
    version: '2',
    timestamp: `${Date.now()}`,
  });

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
    const blockHeader = makeBlockHeader('4660');

    const now = Date.now();
    const result = transactionAdapter.buildTransaction({
      ownerAddress,
      toAddress: recipientAddress,
      amount: '1',
      blockHeader,
      timestamp: `${now}`,
      expiration: `${now + 60_000}`,
    });

    expect(result.payload).toBeDefined();
    expect(result.transaction.type).toBe('trx');
    expect(result.transaction.ownerAddress).toBe(ownerAddress);
    expect(result.transaction.toAddress).toBe(recipientAddress);
    expect(result.transaction.amount).toBe('1');

    const signingInput = decodeSigningInput(result.payload);
    expect(signingInput.transaction?.transfer).toBeDefined();
    expect(signingInput.transaction?.blockHeader).toBeDefined();
    expect(signingInput.transaction?.blockHeader?.number?.toString()).toBe(
      Long.fromString(blockHeader.number).toString(),
    );

    wallet.delete();
  });

  it('builds TRC20 transfer without signing (adapter)', () => {
    const core = walletCore.getCore();
    const wallet = core.HDWallet.create(128, '');
    const ownerAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const recipientAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const contractAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const blockHeader = makeBlockHeader('4660');
    const timestamp = `${Date.now()}`;
    const expiration = `${Date.now() + 60_000}`;

    const result = transactionAdapter.buildTransfer({
      ownerAddress,
      toAddress: recipientAddress,
      contractAddress,
      amount: '1',
      blockHeader,
      timestamp,
      expiration,
      feeLimit: '10000000',
      callValue: '0',
    });

    expect(result.payload).toBeDefined();
    expect(result.transaction.type).toBe('trc20');
    expect(result.transaction.ownerAddress).toBe(ownerAddress);
    expect(result.transaction.toAddress).toBe(recipientAddress);
    expect(result.transaction.amount).toBe('1');
    expect(result.transaction.contractAddress).toBe(contractAddress);
    expect(result.transaction.callValue).toBeNull();

    const signingInput = decodeSigningInput(result.payload);
    const transfer = signingInput.transaction?.transferTrc20Contract;
    expect(transfer).toBeDefined();
    if (!transfer) {
      throw new Error('TRC20 transfer contract missing');
    }
    expect(bytesToDecimal(transfer.amount as Uint8Array)).toBe('1');

    wallet.delete();
  });

  it('rejects non-zero callValue for TRC20 transfer', () => {
    const core = walletCore.getCore();
    const wallet = core.HDWallet.create(128, '');
    const ownerAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const recipientAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const contractAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const blockHeader = makeBlockHeader('4660');

    expect(() =>
      transactionAdapter.buildTransfer({
        ownerAddress,
        toAddress: recipientAddress,
        contractAddress,
        amount: '1',
        blockHeader,
        timestamp: `${Date.now()}`,
        expiration: `${Date.now() + 60_000}`,
        feeLimit: '10000000',
        callValue: '1',
      }),
    ).toThrow(AdapterError);

    wallet.delete();
  });

  it('signs TRX transaction payload (adapter)', () => {
    const core = walletCore.getCore();
    const wallet = core.HDWallet.create(128, '');
    const ownerAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const recipientAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const privateKey = core.HexCoding.encode(
      wallet.getKeyForCoin(core.CoinType.tron).data(),
    );
    const blockHeader = makeBlockHeader('4660');

    const build = transactionAdapter.buildTransaction({
      ownerAddress,
      toAddress: recipientAddress,
      amount: '1',
      blockHeader,
      timestamp: `${Date.now()}`,
      expiration: `${Date.now() + 60_000}`,
    });
    const signed = transactionAdapter.signTransaction({
      payload: build.payload,
      privateKey,
    });

    expect(signed.txId).toBeDefined();
    expect(signed.signature).toBeDefined();
    expect(signed.rawDataHex).toBeDefined();
    expect(signed.signedJson).toBeDefined();
    const signedJson = JSON.parse(signed.signedJson) as {
      raw_data_hex?: string;
    };
    expect(signedJson.raw_data_hex).toBe(signed.rawDataHex);

    wallet.delete();
  });

  it('signs TRC20 transfer payload (adapter)', () => {
    const core = walletCore.getCore();
    const wallet = core.HDWallet.create(128, '');
    const ownerAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const recipientAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const contractAddress = wallet.getAddressForCoin(core.CoinType.tron);
    const privateKey = core.HexCoding.encode(
      wallet.getKeyForCoin(core.CoinType.tron).data(),
    );
    const blockHeader = makeBlockHeader('4660');

    const build = transactionAdapter.buildTransfer({
      ownerAddress,
      toAddress: recipientAddress,
      contractAddress,
      amount: '1',
      blockHeader,
      timestamp: `${Date.now()}`,
      expiration: `${Date.now() + 60_000}`,
      feeLimit: '10000000',
      callValue: '0',
    });
    const signed = transactionAdapter.signTransaction({
      payload: build.payload,
      privateKey,
    });

    expect(signed.txId).toBeDefined();
    expect(signed.signature).toBeDefined();
    expect(signed.rawDataHex).toBeDefined();
    expect(signed.signedJson).toBeDefined();
    const signedJson = JSON.parse(signed.signedJson) as {
      raw_data_hex?: string;
    };
    expect(signedJson.raw_data_hex).toBe(signed.rawDataHex);

    wallet.delete();
  });

  it('throws when payload is invalid', () => {
    expect(() =>
      transactionAdapter.signTransaction({
        payload: '0xzz',
        privateKey: '00'.repeat(32),
      }),
    ).toThrow(AdapterError);
  });
});
