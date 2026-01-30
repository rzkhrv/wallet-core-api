import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BuildBtcTransactionRequestDto } from './dto/request/build-btc-transaction.request.dto';
import { SignBtcTransactionRequestDto } from './dto/request/sign-btc-transaction.request.dto';
import { BuildBtcTransactionResponseDto } from './dto/response/build-btc-transaction.response.dto';
import { SignBtcTransactionResponseDto } from './dto/response/sign-btc-transaction.response.dto';
import { BtcTransactionService } from './service/btc-transaction.service';

@ApiTags('BTC Transaction')
@Controller('api/v1/transaction/btc')
export class BtcTransactionController {
  constructor(private readonly btcTransactionService: BtcTransactionService) {}

  @Post('build-transaction')
  @ApiOperation({ summary: 'Build BTC transaction' })
  @ApiBody({ type: BuildBtcTransactionRequestDto })
  @ApiResponse({ status: 200, type: BuildBtcTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  buildTransaction(
    @Body() body: BuildBtcTransactionRequestDto,
  ): BuildBtcTransactionResponseDto {
    return this.btcTransactionService.buildTransaction(body);
  }

  @Post('sign-transaction')
  @ApiOperation({ summary: 'Sign BTC transaction from build payload' })
  @ApiBody({ type: SignBtcTransactionRequestDto })
  @ApiResponse({ status: 200, type: SignBtcTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  signTransaction(
    @Body() body: SignBtcTransactionRequestDto,
  ): SignBtcTransactionResponseDto {
    return this.btcTransactionService.signTransaction(body);
  }
}
