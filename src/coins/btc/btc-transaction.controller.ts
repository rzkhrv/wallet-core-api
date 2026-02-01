import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BuildBtcTransactionRequestDto } from './dto/request/build-btc-transaction.request.dto';
import { SignBtcTransactionRequestDto } from './dto/request/sign-btc-transaction.request.dto';
import { BuildBtcTransactionResponseDto } from './dto/response/build-btc-transaction.response.dto';
import { SignBtcTransactionResponseDto } from './dto/response/sign-btc-transaction.response.dto';
import { BtcTransactionService } from './service/btc-transaction.service';

type AdminTestResponse = {
  status: 'ok';
};

/**
 * Handles BTC transaction endpoints.
 */
@ApiTags('BTC Transaction')
@Controller('api/v1/transaction/btc')
export class BtcTransactionController {
  constructor(private readonly btcTransactionService: BtcTransactionService) {}

  /**
   * Builds a BTC transaction from request data.
   * @param body Request payload.
   * @returns Unsigned transaction payload and plan.
   */
  @Post('build-transaction')
  @ApiOperation({ summary: 'Build BTC transaction' })
  @ApiBody({ type: BuildBtcTransactionRequestDto })
  @ApiResponse({ status: 201, type: BuildBtcTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  buildTransaction(
    @Body() body: BuildBtcTransactionRequestDto,
  ): BuildBtcTransactionResponseDto {
    return this.btcTransactionService.buildTransaction(body);
  }

  /**
   * Signs a BTC transaction payload.
   * @param body Request payload.
   * @returns Signed transaction data.
   */
  @Post('sign-transaction')
  @ApiOperation({ summary: 'Sign BTC transaction from build payload' })
  @ApiBody({ type: SignBtcTransactionRequestDto })
  @ApiResponse({ status: 201, type: SignBtcTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  signTransaction(
    @Body() body: SignBtcTransactionRequestDto,
  ): SignBtcTransactionResponseDto {
    return this.btcTransactionService.signTransaction(body);
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
