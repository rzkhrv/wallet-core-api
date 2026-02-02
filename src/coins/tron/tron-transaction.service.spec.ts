import { TronTransactionService } from './service/tron-transaction.service';
import { TronTransactionAdapter } from './adapter/tron-transaction.adapter';
import { WalletCoreAdapter } from '../../common/wallet-core/wallet-core.adapter';

describe('TRON transaction service', () => {
  const normalizeHex = (value: string): string =>
    value.startsWith('0x') || value.startsWith('0X') ? value.slice(2) : value;
  const encodePayload = (rawJson: string): string =>
    `0x${Buffer.from(rawJson, 'utf8').toString('hex')}`;
  const makeTrc20Data = (addressHex: string, amountHex: string): string => {
    const selector = Buffer.from('a9059cbb', 'hex');
    const addressBytes = Buffer.from(addressHex, 'hex');
    const addressWord = Buffer.concat([Buffer.alloc(12), addressBytes]);
    const amountWord = Buffer.from(amountHex.padStart(64, '0'), 'hex');
    return Buffer.concat([selector, addressWord, amountWord]).toString(
      'base64',
    );
  };
  const trc20AddressHex = '11'.repeat(20);
  const trc20AmountHex = '64';
  const trc20Data = makeTrc20Data(trc20AddressHex, trc20AmountHex);
  const adapterBuildResponse = {
    rawJson: JSON.stringify({
      transfer: {
        ownerAddress: 'TJSON',
        toAddress: 'TDEST',
        amount: '2',
      },
      timestamp: '1000',
      expiration: '2000',
    }),
  };
  const signResponse = {
    txId: 'aa',
    signature: 'bb',
    refBlockBytes: 'cc',
    refBlockHash: 'dd',
    rawDataHex: 'ee',
    signedJson: '{}',
    visible: false,
  };

  const makeService = () => {
    const adapter: {
      buildTransaction: jest.Mock;
      buildTransfer: jest.Mock;
      signTransaction: jest.Mock;
    } = {
      buildTransaction: jest.fn().mockReturnValue(adapterBuildResponse),
      buildTransfer: jest.fn().mockReturnValue(adapterBuildResponse),
      signTransaction: jest.fn().mockReturnValue(signResponse),
    };
    const walletCore: WalletCoreAdapter = {
      getCore: () => ({
        Base58: {
          encode: (data: Uint8Array | Buffer) =>
            `T${Buffer.from(data).toString('hex')}`,
        },
        HexCoding: {
          encode: (data: Uint8Array | Buffer) =>
            `0x${Buffer.from(data).toString('hex')}`,
          decode: (value: string) =>
            Uint8Array.from(Buffer.from(normalizeHex(value), 'hex')),
        },
      }),
    } as WalletCoreAdapter;
    return {
      adapter,
      service: new TronTransactionService(
        adapter as unknown as TronTransactionAdapter,
        walletCore,
      ),
    };
  };

  it('builds TRX transaction from params', () => {
    const { adapter, service } = makeService();
    const result = service.buildTransaction({
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      amount: '1',
      blockId: '11'.repeat(32),
      blockNumber: '1',
    });
    expect(result).toEqual({
      payload: encodePayload(adapterBuildResponse.rawJson),
      transaction: {
        type: 'trx',
        ownerAddress: 'TJSON',
        toAddress: 'TDEST',
        amount: '2',
        timestamp: '1000',
        expiration: '2000',
        feeLimit: null,
        memo: null,
      },
    });
    expect(adapter.buildTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerAddress: 'TXYZ',
        toAddress: 'TABC',
        amount: '1',
        blockId: '11'.repeat(32),
        blockNumber: '1',
      }),
    );
  });

  it('builds TRC10 transfer from params', () => {
    const { adapter, service } = makeService();
    const trc10Response = {
      rawJson: JSON.stringify({
        transferAsset: {
          ownerAddress: 'TOWNER',
          toAddress: 'TRECEIVER',
          amount: '100',
          assetName: 'ASSET',
        },
        timestamp: '1000',
        expiration: '2000',
      }),
    };
    adapter.buildTransfer.mockReturnValue(trc10Response);
    const result = service.buildTransfer({
      transferType: 'trc10',
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      amount: '100',
      blockId: '11'.repeat(32),
      blockNumber: '1',
      assetName: 'TOKEN',
    });
    expect(result).toEqual({
      payload: encodePayload(trc10Response.rawJson),
      transaction: {
        type: 'trc10',
        ownerAddress: 'TOWNER',
        toAddress: 'TRECEIVER',
        amount: '100',
        assetName: 'ASSET',
        contractAddress: undefined,
        callValue: undefined,
        timestamp: '1000',
        expiration: '2000',
        feeLimit: null,
        memo: null,
      },
    });
    expect(adapter.buildTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        transferType: 'trc10',
        assetName: 'TOKEN',
        blockId: '11'.repeat(32),
        blockNumber: '1',
      }),
    );
  });

  it('builds TRC20 transfer from params', () => {
    const { adapter, service } = makeService();
    const trc20Response = {
      rawJson: JSON.stringify({
        triggerSmartContract: {
          ownerAddress: 'TOWNER',
          contractAddress: 'TCONTRACT',
          data: trc20Data,
          callValue: '0',
        },
        timestamp: '1000',
        expiration: '2000',
        feeLimit: '10000000',
      }),
    };
    adapter.buildTransfer.mockReturnValue(trc20Response);
    const result = service.buildTransfer({
      transferType: 'trc20',
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      contractAddress: 'TCONTRACT',
      amount: '100',
      blockId: '11'.repeat(32),
      blockNumber: '1',
      callValue: '0',
      feeLimit: '10000000',
    });
    expect(result).toEqual({
      payload: encodePayload(trc20Response.rawJson),
      transaction: {
        type: 'trc20',
        ownerAddress: 'TOWNER',
        toAddress: `T41${trc20AddressHex}`,
        amount: '100',
        assetName: undefined,
        contractAddress: 'TCONTRACT',
        callValue: '0',
        timestamp: '1000',
        expiration: '2000',
        feeLimit: '10000000',
        memo: null,
      },
    });
    expect(adapter.buildTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        transferType: 'trc20',
        contractAddress: 'TCONTRACT',
        callValue: '0',
        feeLimit: '10000000',
        blockId: '11'.repeat(32),
        blockNumber: '1',
      }),
    );
  });

  it('signs raw transaction when payload is provided', () => {
    const { adapter, service } = makeService();
    const payload = encodePayload('{"raw_data":{}}');
    const result = service.sign({
      payload,
      privateKey: '00'.repeat(32),
      txId: 'txid',
    });
    expect(result).toBe(signResponse);
    expect(adapter.signTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        rawJson: '{"raw_data":{}}',
        privateKey: '00'.repeat(32),
        txId: 'txid',
      }),
    );
  });
});
