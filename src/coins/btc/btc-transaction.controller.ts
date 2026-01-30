import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BuildBtcTransactionRequestDto } from './dto/request/build-btc-transaction.request.dto';
import { BuildBtcTransactionResponseDto } from './dto/response/build-btc-transaction.response.dto';
import { BtcTransactionService } from './service/btc-transaction.service';

@ApiTags('BTC Transaction')
@Controller('api/v1/transaction/btc')
export class BtcTransactionController {
  constructor(private readonly btcTransactionService: BtcTransactionService) {}

  @Post('build-transaction')
  @ApiOperation({ summary: 'Build and sign BTC transaction' })
  @ApiBody({ type: BuildBtcTransactionRequestDto })
  @ApiResponse({ status: 200, type: BuildBtcTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  buildTransaction(
    @Body() body: BuildBtcTransactionRequestDto,
  ): BuildBtcTransactionResponseDto {
    return this.btcTransactionService.buildTransaction(body);
  }
}
