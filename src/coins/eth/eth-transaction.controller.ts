import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BuildEthErc20TransferRequestDto } from './dto/request/build-eth-erc20-transfer.request.dto';
import { BuildEthTransactionRequestDto } from './dto/request/build-eth-transaction.request.dto';
import { BuildEthErc20TransferResponseDto } from './dto/response/build-eth-erc20-transfer.response.dto';
import { BuildEthTransactionResponseDto } from './dto/response/build-eth-transaction.response.dto';
import { EthTransactionService } from './service/eth-transaction.service';

@ApiTags('ETH Transaction')
@Controller('api/v1/transaction/eth')
export class EthTransactionController {
  constructor(private readonly ethTransactionService: EthTransactionService) {}

  @Post('build-transaction')
  @ApiOperation({ summary: 'Build and sign ETH transaction' })
  @ApiBody({ type: BuildEthTransactionRequestDto })
  @ApiResponse({ status: 200, type: BuildEthTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  buildTransaction(
    @Body() body: BuildEthTransactionRequestDto,
  ): BuildEthTransactionResponseDto {
    return this.ethTransactionService.buildTransaction(body);
  }

  @Post('build-transfer')
  @ApiOperation({ summary: 'Build and sign ETH ERC20 transfer' })
  @ApiBody({ type: BuildEthErc20TransferRequestDto })
  @ApiResponse({ status: 200, type: BuildEthErc20TransferResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  buildTransfer(
    @Body() body: BuildEthErc20TransferRequestDto,
  ): BuildEthErc20TransferResponseDto {
    return this.ethTransactionService.buildTransfer(body);
  }
}
