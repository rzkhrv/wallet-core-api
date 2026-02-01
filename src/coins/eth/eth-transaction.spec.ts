import { TW } from '@trustwallet/wallet-core';
import { EthTransactionAdapter } from './adapter/eth-transaction.adapter';
import { AdapterError } from '../../common/errors/adapter-error';
import { WalletCoreAdapter } from '../../common/wallet-core/wallet-core.adapter';
import { EthTransactionService } from './service/eth-transaction.service';

const resolveEthTransferAmount = (
  payload: string,
  walletCore: WalletCoreAdapter,
): bigint => {
  const core: ReturnType<WalletCoreAdapter['getCore']> = walletCore.getCore();
  const normalizedPayload: string =
    payload.startsWith('0x') || payload.startsWith('0X')
      ? payload.slice(2)
      : payload;
  const payloadBytes: Uint8Array = core.HexCoding.decode(normalizedPayload);
  const signingInput: TW.Ethereum.Proto.SigningInput =
    TW.Ethereum.Proto.SigningInput.decode(payloadBytes);
  const amountBytes: Uint8Array =
    signingInput.transaction?.transfer?.amount ?? new Uint8Array();
  const amountHex: string = core.HexCoding.encode(amountBytes);
  const normalizedHex: string =
    amountHex.startsWith('0x') || amountHex.startsWith('0X')
      ? amountHex.slice(2)
      : amountHex;
  const safeHex: string = normalizedHex.length === 0 ? '0' : normalizedHex;
  const amount: bigint = BigInt(`0x${safeHex}`);
  return amount;
};

describe('ETH transaction signing', () => {
  let walletCore: WalletCoreAdapter;
  let transactionAdapter: EthTransactionAdapter;
  let transactionService: EthTransactionService;

  beforeAll(async () => {
    walletCore = new WalletCoreAdapter();
    await walletCore.onModuleInit();
    transactionAdapter = new EthTransactionAdapter(walletCore);
    transactionService = new EthTransactionService(transactionAdapter);
  });

  it('builds ERC20 transfer (adapter)', () => {
    const result = transactionAdapter.buildTransfer({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '60000',
      toAddress: '0x1111111111111111111111111111111111111111',
      tokenContract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      amount: '1000000',
    });

    expect(result.payload).toBeDefined();
  });

  it('signs ERC20 transfer (adapter)', () => {
    const buildResult = transactionAdapter.buildTransfer({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '60000',
      toAddress: '0x1111111111111111111111111111111111111111',
      tokenContract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      amount: '1000000',
    });

    const result = transactionAdapter.signTransaction({
      payload: buildResult.payload,
      privateKey:
        '4c0883a69102937d6231471b5dbb6204fe512961708279004a0b7b6f1b7f5f30',
    });

    expect(result.rawTx).toBeDefined();
    expect(result.signature.v).toBeDefined();
    expect(result.signature.r).toBeDefined();
    expect(result.signature.s).toBeDefined();
  });

  it('builds ETH transaction (adapter)', () => {
    const result = transactionAdapter.buildTransaction({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '21000',
      toAddress: '0x1111111111111111111111111111111111111111',
      amount: '1000000000000000',
    });

    expect(result.payload).toBeDefined();
  });

  it('parses decimal and hex amounts in build payload (adapter)', () => {
    const decimalPayload: string = transactionAdapter.buildTransaction({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '21000',
      toAddress: '0x1111111111111111111111111111111111111111',
      amount: '10',
    }).payload;
    const decimalAmount: bigint = resolveEthTransferAmount(
      decimalPayload,
      walletCore,
    );
    expect(decimalAmount).toBe(10n);
    const hexPayload: string = transactionAdapter.buildTransaction({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '21000',
      toAddress: '0x1111111111111111111111111111111111111111',
      amount: '0x10',
    }).payload;
    const hexAmount: bigint = resolveEthTransferAmount(hexPayload, walletCore);
    expect(hexAmount).toBe(16n);
  });

  it('signs ETH transaction (adapter)', () => {
    const buildResult = transactionAdapter.buildTransaction({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '21000',
      toAddress: '0x1111111111111111111111111111111111111111',
      amount: '1000000000000000',
    });

    const result = transactionAdapter.signTransaction({
      payload: buildResult.payload,
      privateKey:
        '4c0883a69102937d6231471b5dbb6204fe512961708279004a0b7b6f1b7f5f30',
    });

    expect(result.rawTx).toBeDefined();
    expect(result.signature.v).toBeDefined();
    expect(result.signature.r).toBeDefined();
    expect(result.signature.s).toBeDefined();
  });

  it('builds ERC20 transfer (service)', () => {
    const result = transactionService.buildTransfer({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '60000',
      toAddress: '0x1111111111111111111111111111111111111111',
      tokenContract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      amount: '1000000',
    });

    expect(result.payload).toBeDefined();
  });

  it('builds ETH transaction (service)', () => {
    const result = transactionService.buildTransaction({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '21000',
      toAddress: '0x1111111111111111111111111111111111111111',
      amount: '1000000000000000',
    });

    expect(result.payload).toBeDefined();
  });

  it('signs ERC20 transfer (service)', () => {
    const buildResult = transactionService.buildTransfer({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '60000',
      toAddress: '0x1111111111111111111111111111111111111111',
      tokenContract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      amount: '1000000',
    });

    const result = transactionService.sign({
      payload: buildResult.payload,
      privateKey:
        '4c0883a69102937d6231471b5dbb6204fe512961708279004a0b7b6f1b7f5f30',
    });

    expect(result.rawTx).toBeDefined();
  });

  it('signs ETH transaction (service)', () => {
    const buildResult = transactionService.buildTransaction({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '21000',
      toAddress: '0x1111111111111111111111111111111111111111',
      amount: '1000000000000000',
    });

    const result = transactionService.sign({
      payload: buildResult.payload,
      privateKey:
        '4c0883a69102937d6231471b5dbb6204fe512961708279004a0b7b6f1b7f5f30',
    });

    expect(result.rawTx).toBeDefined();
  });

  it('throws on invalid private key', () => {
    const buildResult = transactionAdapter.buildTransfer({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '60000',
      toAddress: '0x1111111111111111111111111111111111111111',
      tokenContract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      amount: '1000000',
    });

    expect(() =>
      transactionAdapter.signTransaction({
        payload: buildResult.payload,
        privateKey: 'invalid',
      }),
    ).toThrow(AdapterError);
  });

  it('throws on invalid private key for ETH transaction', () => {
    const buildResult = transactionAdapter.buildTransaction({
      chainId: '1',
      nonce: '0',
      gasPrice: '20000000000',
      gasLimit: '21000',
      toAddress: '0x1111111111111111111111111111111111111111',
      amount: '1000000000000000',
    });

    expect(() =>
      transactionAdapter.signTransaction({
        payload: buildResult.payload,
        privateKey: 'invalid',
      }),
    ).toThrow(AdapterError);
  });

  it('throws on invalid payload', () => {
    expect(() =>
      transactionAdapter.signTransaction({
        payload: 'invalid',
        privateKey:
          '4c0883a69102937d6231471b5dbb6204fe512961708279004a0b7b6f1b7f5f30',
      }),
    ).toThrow(AdapterError);
  });
});
