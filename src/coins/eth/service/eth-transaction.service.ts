import { Injectable, Logger } from '@nestjs/common';
import { EthTransactionAdapter } from '../../../adapter/coins/eth/eth-transaction.adapter';
import {
  EthErc20TransferAdapterRequest,
  EthErc20TransferAdapterResponse,
} from '../../../adapter/coins/eth/dto/eth-erc20-transfer.dto';
import {
  EthTransactionBuildAdapterRequest,
  EthTransactionBuildAdapterResponse,
} from '../../../adapter/coins/eth/dto/eth-transaction-build.dto';
import { CoinTransactionService } from '../../contracts/coin-service.contracts';
import { BuildEthErc20TransferRequestDto } from '../dto/request/build-eth-erc20-transfer.request.dto';
import { BuildEthTransactionRequestDto } from '../dto/request/build-eth-transaction.request.dto';
import { BuildEthErc20TransferResponseDto } from '../dto/response/build-eth-erc20-transfer.response.dto';
import { BuildEthTransactionResponseDto } from '../dto/response/build-eth-transaction.response.dto';

@Injectable()
export class EthTransactionService implements CoinTransactionService<
  BuildEthTransactionRequestDto,
  BuildEthTransactionResponseDto,
  BuildEthErc20TransferRequestDto,
  BuildEthErc20TransferResponseDto
> {
  private readonly logger = new Logger(EthTransactionService.name);

  constructor(private readonly ethTransactionAdapter: EthTransactionAdapter) {}

  buildTransaction(
    request: BuildEthTransactionRequestDto,
  ): BuildEthTransactionResponseDto {
    this.logger.log('Building ETH transaction');
    const adapterRequest: EthTransactionBuildAdapterRequest = {
      chainId: request.chainId,
      nonce: request.nonce,
      gasPrice: request.gasPrice,
      gasLimit: request.gasLimit,
      toAddress: request.toAddress,
      amount: request.amount,
      privateKey: request.privateKey,
    };

    const result: EthTransactionBuildAdapterResponse =
      this.ethTransactionAdapter.buildTransaction(adapterRequest);

    return result;
  }

  buildTransfer(
    request: BuildEthErc20TransferRequestDto,
  ): BuildEthErc20TransferResponseDto {
    this.logger.log('Building ETH ERC20 transfer');
    const adapterRequest: EthErc20TransferAdapterRequest = {
      chainId: request.chainId,
      nonce: request.nonce,
      gasPrice: request.gasPrice,
      gasLimit: request.gasLimit,
      toAddress: request.toAddress,
      tokenContract: request.tokenContract,
      amount: request.amount,
      privateKey: request.privateKey,
    };

    const result: EthErc20TransferAdapterResponse =
      this.ethTransactionAdapter.buildTransfer(adapterRequest);

    return result;
  }
}
