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
  const smartContractTypeUrlJson = JSON.stringify({
    raw_data: {
      contract: [
        {
          parameter: {
            type_url: 'type.googleapis.com/protocol.TriggerSmartContract',
          },
        },
      ],
    },
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
    } as unknown as TronTransactionAdapter;
    return {
      adapter,
      service: new TronTransactionService(adapter),
    };
  };

  it('builds transfer when rawJson is a transfer contract', () => {
    const { adapter, service } = makeService();
    const result = service.buildTransfer({
      rawJson: transferJson,
      privateKey: '00'.repeat(32),
    });

    expect(result).toBe(mockResponse);
    expect(adapter.buildTransaction).toHaveBeenCalledTimes(1);
  });

  it('rejects transfer endpoint for smart contract rawJson', () => {
    const { service } = makeService();
    expect(() =>
      service.buildTransfer({
        rawJson: smartContractJson,
        privateKey: '00'.repeat(32),
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects transfer endpoint for unknown contract type', () => {
    const { service } = makeService();
    expect(() =>
      service.buildTransfer({
        rawJson: unknownContractJson,
        privateKey: '00'.repeat(32),
      }),
    ).toThrow(BadRequestException);
  });

  it('builds smart contract when rawJson is smart contract', () => {
    const { adapter, service } = makeService();
    const result = service.buildSmartContract({
      rawJson: smartContractJson,
      privateKey: '00'.repeat(32),
    });

    expect(result).toBe(mockResponse);
    expect(adapter.buildTransaction).toHaveBeenCalledTimes(1);
  });

  it('builds smart contract when rawJson uses type_url', () => {
    const { adapter, service } = makeService();
    const result = service.buildSmartContract({
      rawJson: smartContractTypeUrlJson,
      privateKey: '00'.repeat(32),
    });

    expect(result).toBe(mockResponse);
    expect(adapter.buildTransaction).toHaveBeenCalledTimes(1);
  });

  it('rejects smart contract endpoint for transfer rawJson', () => {
    const { service } = makeService();
    expect(() =>
      service.buildSmartContract({
        rawJson: transferJson,
        privateKey: '00'.repeat(32),
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects smart contract endpoint for unknown contract type', () => {
    const { service } = makeService();
    expect(() =>
      service.buildSmartContract({
        rawJson: unknownContractJson,
        privateKey: '00'.repeat(32),
      }),
    ).toThrow(BadRequestException);
  });
});
