import { Injectable, Logger } from '@nestjs/common';
import { EthTransactionAdapter } from '../../../adapter/coins/eth/eth-transaction.adapter';
import { EthErc20TransferBuildAdapterRequest } from '../../../adapter/coins/eth/dto/eth-erc20-transfer.dto';
import { EthErc20TransferBuildAdapterResponse } from '../../../adapter/coins/eth/dto/eth-erc20-transfer-response.dto';
import { EthErc20TransferSignAdapterRequest } from '../../../adapter/coins/eth/dto/eth-erc20-transfer-sign.dto';
import { EthErc20TransferSignAdapterResponse } from '../../../adapter/coins/eth/dto/eth-erc20-transfer-sign-response.dto';
import { EthTransactionBuildAdapterRequest } from '../../../adapter/coins/eth/dto/eth-transaction-build.dto';
import { EthTransactionBuildAdapterResponse } from '../../../adapter/coins/eth/dto/eth-transaction-build-response.dto';
import { EthTransactionSignAdapterRequest } from '../../../adapter/coins/eth/dto/eth-transaction-sign.dto';
import { EthTransactionSignAdapterResponse } from '../../../adapter/coins/eth/dto/eth-transaction-sign-response.dto';
import { CoinTransactionService } from '../../contracts/coin-transaction-service.interface';
import { BuildEthErc20TransferRequestDto } from '../dto/request/build-eth-erc20-transfer.request.dto';
import { BuildEthTransactionRequestDto } from '../dto/request/build-eth-transaction.request.dto';
import { SignEthErc20TransferRequestDto } from '../dto/request/sign-eth-erc20-transfer.request.dto';
import { SignEthTransactionRequestDto } from '../dto/request/sign-eth-transaction.request.dto';
import { BuildEthErc20TransferResponseDto } from '../dto/response/build-eth-erc20-transfer.response.dto';
import { BuildEthTransactionResponseDto } from '../dto/response/build-eth-transaction.response.dto';
import { SignEthErc20TransferResponseDto } from '../dto/response/sign-eth-erc20-transfer.response.dto';
import { SignEthTransactionResponseDto } from '../dto/response/sign-eth-transaction.response.dto';

/**
 * Provides ETH transaction build and signing operations.
 */
@Injectable()
export class EthTransactionService implements CoinTransactionService<
  BuildEthTransactionRequestDto,
  BuildEthTransactionResponseDto,
  BuildEthErc20TransferRequestDto,
  BuildEthErc20TransferResponseDto
> {
  private readonly logger = new Logger(EthTransactionService.name);

  constructor(private readonly ethTransactionAdapter: EthTransactionAdapter) {}

  /**
   * Builds an ETH transaction payload.
   * @param request Request payload.
   * @returns Unsigned transaction response.
   */
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
    };

    const result: EthTransactionBuildAdapterResponse =
      this.ethTransactionAdapter.buildTransaction(adapterRequest);

    return result;
  }

  /**
   * Builds an ERC20 transfer payload.
   * @param request Request payload.
   * @returns Unsigned transfer response.
   */
  buildTransfer(
    request: BuildEthErc20TransferRequestDto,
  ): BuildEthErc20TransferResponseDto {
    this.logger.log('Building ETH ERC20 transfer');
    const adapterRequest: EthErc20TransferBuildAdapterRequest = {
      chainId: request.chainId,
      nonce: request.nonce,
      gasPrice: request.gasPrice,
      gasLimit: request.gasLimit,
      toAddress: request.toAddress,
      tokenContract: request.tokenContract,
      amount: request.amount,
    };

    const result: EthErc20TransferBuildAdapterResponse =
      this.ethTransactionAdapter.buildTransfer(adapterRequest);

    return result;
  }

  /**
   * Signs an ETH transaction payload.
   * @param request Request payload.
   * @returns Signed transaction response.
   */
  signTransaction(
    request: SignEthTransactionRequestDto,
  ): SignEthTransactionResponseDto {
    this.logger.log('Signing ETH transaction');
    const adapterRequest: EthTransactionSignAdapterRequest = {
      payload: request.payload,
      privateKey: request.privateKey,
    };

    const result: EthTransactionSignAdapterResponse =
      this.ethTransactionAdapter.signTransaction(adapterRequest);

    return result;
  }

  /**
   * Signs an ERC20 transfer payload.
   * @param request Request payload.
   * @returns Signed transfer response.
   */
  signTransfer(
    request: SignEthErc20TransferRequestDto,
  ): SignEthErc20TransferResponseDto {
    this.logger.log('Signing ETH ERC20 transfer');
    const adapterRequest: EthErc20TransferSignAdapterRequest = {
      payload: request.payload,
      privateKey: request.privateKey,
    };

    const result: EthErc20TransferSignAdapterResponse =
      this.ethTransactionAdapter.signTransfer(adapterRequest);

    return result;
  }
}
