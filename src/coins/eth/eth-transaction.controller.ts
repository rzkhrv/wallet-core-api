import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BuildEthErc20TransferRequestDto } from './dto/request/build-eth-erc20-transfer.request.dto';
import { BuildEthTransactionRequestDto } from './dto/request/build-eth-transaction.request.dto';
import { SignEthErc20TransferRequestDto } from './dto/request/sign-eth-erc20-transfer.request.dto';
import { SignEthTransactionRequestDto } from './dto/request/sign-eth-transaction.request.dto';
import { BuildEthErc20TransferResponseDto } from './dto/response/build-eth-erc20-transfer.response.dto';
import { BuildEthTransactionResponseDto } from './dto/response/build-eth-transaction.response.dto';
import { SignEthErc20TransferResponseDto } from './dto/response/sign-eth-erc20-transfer.response.dto';
import { SignEthTransactionResponseDto } from './dto/response/sign-eth-transaction.response.dto';
import { EthTransactionService } from './service/eth-transaction.service';

type AdminTestResponse = {
  status: 'ok';
};

/**
 * Handles ETH transaction endpoints.
 */
@ApiTags('ETH Transaction')
@Controller('api/v1/transaction/eth')
export class EthTransactionController {
  constructor(private readonly ethTransactionService: EthTransactionService) {}

  /**
   * Builds an ETH transaction from request data.
   * @param body Request payload.
   * @returns Unsigned transaction payload.
   */
  @Post('build-transaction')
  @ApiOperation({ summary: 'Build ETH transaction' })
  @ApiBody({ type: BuildEthTransactionRequestDto })
  @ApiResponse({ status: 201, type: BuildEthTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  buildTransaction(
    @Body() body: BuildEthTransactionRequestDto,
  ): BuildEthTransactionResponseDto {
    return this.ethTransactionService.buildTransaction(body);
  }

  /**
   * Builds an ERC20 transfer payload.
   * @param body Request payload.
   * @returns Unsigned transfer payload.
   */
  @Post('build-transfer')
  @ApiOperation({ summary: 'Build ETH ERC20 transfer' })
  @ApiBody({ type: BuildEthErc20TransferRequestDto })
  @ApiResponse({ status: 201, type: BuildEthErc20TransferResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  buildTransfer(
    @Body() body: BuildEthErc20TransferRequestDto,
  ): BuildEthErc20TransferResponseDto {
    return this.ethTransactionService.buildTransfer(body);
  }

  /**
   * Signs an ETH transaction payload.
   * @param body Request payload.
   * @returns Signed transaction response.
   */
  @Post('sign-transaction')
  @ApiOperation({ summary: 'Sign ETH transaction from build payload' })
  @ApiBody({ type: SignEthTransactionRequestDto })
  @ApiResponse({ status: 201, type: SignEthTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  signTransaction(
    @Body() body: SignEthTransactionRequestDto,
  ): SignEthTransactionResponseDto {
    return this.ethTransactionService.signTransaction(body);
  }

  /**
   * Signs an ERC20 transfer payload.
   * @param body Request payload.
   * @returns Signed transfer response.
   */
  @Post('sign-transfer')
  @ApiOperation({ summary: 'Sign ETH ERC20 transfer from build payload' })
  @ApiBody({ type: SignEthErc20TransferRequestDto })
  @ApiResponse({ status: 201, type: SignEthErc20TransferResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  signTransfer(
    @Body() body: SignEthErc20TransferRequestDto,
  ): SignEthErc20TransferResponseDto {
    return this.ethTransactionService.signTransfer(body);
  }

  /**
   * Returns a simple admin smoke test response.
   * @returns Admin test response.
   */
  @Get('admin/test')
  @ApiOperation({ summary: 'Admin smoke test' })
  @ApiResponse({ status: 200, schema: { example: { status: 'ok' } } })
  adminTest(): AdminTestResponse {
    return { status: 'ok' };
  }
}
