import { Injectable, Logger } from '@nestjs/common';
import { EthTransactionAdapter } from '../adapter/eth-transaction.adapter';
import { EthErc20TransferBuildAdapterInput } from '../adapter/dto/eth-erc20-transfer-build-input.dto';
import { EthErc20TransferBuildAdapterOutput } from '../adapter/dto/eth-erc20-transfer-build-output.dto';
import { EthTransactionBuildAdapterInput } from '../adapter/dto/eth-transaction-build-input.dto';
import { EthTransactionBuildAdapterOutput } from '../adapter/dto/eth-transaction-build-output.dto';
import { EthTransactionSignAdapterInput } from '../adapter/dto/eth-transaction-sign-input.dto';
import { EthTransactionSignAdapterOutput } from '../adapter/dto/eth-transaction-sign-output.dto';
import { CoinTransactionService } from '../../../common/interfaces/coin-transaction-service.interface';
import { BuildEthErc20TransferRequestDto } from '../dto/request/build-eth-erc20-transfer.request.dto';
import { BuildEthTransactionRequestDto } from '../dto/request/build-eth-transaction.request.dto';
import { SignEthTransactionRequestDto } from '../dto/request/sign-eth-transaction.request.dto';
import { BuildEthErc20TransferResponseDto } from '../dto/response/build-eth-erc20-transfer.response.dto';
import { BuildEthTransactionResponseDto } from '../dto/response/build-eth-transaction.response.dto';
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
    const adapterRequest: EthTransactionBuildAdapterInput = {
      chainId: request.chainId,
      nonce: request.nonce,
      gasPrice: request.gasPrice,
      gasLimit: request.gasLimit,
      toAddress: request.toAddress,
      amount: request.amount,
    };

    const result: EthTransactionBuildAdapterOutput =
      this.ethTransactionAdapter.buildTransaction(adapterRequest);

    return {
      payload: result.payload,
      transaction: result.transaction,
    };
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
    const adapterRequest: EthErc20TransferBuildAdapterInput = {
      chainId: request.chainId,
      nonce: request.nonce,
      gasPrice: request.gasPrice,
      gasLimit: request.gasLimit,
      toAddress: request.toAddress,
      tokenContract: request.tokenContract,
      amount: request.amount,
    };

    const result: EthErc20TransferBuildAdapterOutput =
      this.ethTransactionAdapter.buildTransfer(adapterRequest);

    return {
      payload: result.payload,
      transaction: result.transaction,
    };
  }

  /**
   * Signs an ETH transaction payload.
   * @param request Request payload.
   * @returns Signed transaction response.
   */
  sign(request: SignEthTransactionRequestDto): SignEthTransactionResponseDto {
    this.logger.log('Signing ETH transaction');
    const adapterRequest: EthTransactionSignAdapterInput = {
      payload: request.payload,
      privateKey: request.privateKey,
    };

    const result: EthTransactionSignAdapterOutput =
      this.ethTransactionAdapter.signTransaction(adapterRequest);

    return result;
  }
}
