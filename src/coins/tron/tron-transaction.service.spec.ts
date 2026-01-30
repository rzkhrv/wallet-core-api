import { BadRequestException } from '@nestjs/common';
import { TronTransactionService } from './service/tron-transaction.service';
import { TronTransactionAdapter } from '../../adapter/coins/tron/tron-transaction.adapter';

describe('TRON transaction service', () => {
  const transferJson = JSON.stringify({
    raw_data: { contract: [{ type: 'TransferContract' }] },
  });
  const smartContractJson = JSON.stringify({
    raw_data: { contract: [{ type: 'TriggerSmartContract' }] },
  });
  const unknownContractJson = JSON.stringify({
    raw_data: { contract: [{ type: 'VoteWitnessContract' }] },
  });

  const mockResponse = {
    txId: 'aa',
    signature: 'bb',
    refBlockBytes: 'cc',
    refBlockHash: 'dd',
    signedJson: '{}',
  };

  const makeService = () => {
    const adapter = {
      buildTransaction: jest.fn().mockReturnValue(mockResponse),
      buildTransfer: jest.fn().mockReturnValue(mockResponse),
    } as unknown as TronTransactionAdapter;
    return {
      adapter,
      service: new TronTransactionService(adapter),
    };
  };

  it('builds transfer from params using transfer contract', () => {
    const { adapter, service } = makeService();
    const result = service.buildTransfer({
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      amount: '1',
      privateKey: '00'.repeat(32),
    });

    expect(result).toBe(mockResponse);
    expect(adapter.buildTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        transferType: 'trx',
      }),
    );
  });

  it('builds TRC10 transaction when transferType is trc10', () => {
    const { adapter, service } = makeService();
    const result = service.buildTransaction({
      transferType: 'trc10',
      ownerAddress: 'TXYZ',
      toAddress: 'TABC',
      amount: '100',
      assetName: 'TOKEN',
      privateKey: '00'.repeat(32),
    });

    expect(result).toBe(mockResponse);
    expect(adapter.buildTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        transferType: 'trc10',
        assetName: 'TOKEN',
      }),
    );
  });

  it('signs raw transfer when rawJson is a transfer contract', () => {
    const { adapter, service } = makeService();
    const result = service.signRawTransfer({
      rawJson: transferJson,
      privateKey: '00'.repeat(32),
    });

    expect(result).toBe(mockResponse);
    expect(adapter.buildTransaction).toHaveBeenCalledTimes(1);
  });

  it('rejects raw transfer signing for smart contract rawJson', () => {
    const { service } = makeService();
    expect(() =>
      service.signRawTransfer({
        rawJson: smartContractJson,
        privateKey: '00'.repeat(32),
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects raw transfer signing for unknown contract type', () => {
    const { service } = makeService();
    expect(() =>
      service.signRawTransfer({
        rawJson: unknownContractJson,
        privateKey: '00'.repeat(32),
      }),
    ).toThrow(BadRequestException);
  });
});
