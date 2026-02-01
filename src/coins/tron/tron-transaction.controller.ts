import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BuildTronTransactionRequestDto } from './dto/request/build-tron-transaction.request.dto';
import { BuildTronTransferRequestDto } from './dto/request/build-tron-transfer.request.dto';
import { SignTronRawTransactionRequestDto } from './dto/request/sign-tron-raw-transaction.request.dto';
import { BuildTronTransactionResponseDto } from './dto/response/build-tron-transaction.response.dto';
import { SignTronTransactionResponseDto } from './dto/response/sign-tron-transaction.response.dto';
import { TronTransactionService } from './service/tron-transaction.service';

/**
 * Handles TRON transaction endpoints.
 */
@ApiTags('TRON Transaction')
@Controller('api/v1/transaction/tron')
export class TronTransactionController {
  constructor(
    private readonly tronTransactionService: TronTransactionService,
  ) {}

  /**
   * Builds a TRON token transfer from request parameters.
   * @param body Request payload.
   * @returns Unsigned transaction payload.
   */
  @Post('build-transfer')
  @ApiOperation({ summary: 'Build TRON token transfer from params (unsigned)' })
  @ApiBody({ type: BuildTronTransferRequestDto })
  @ApiResponse({ status: 201, type: BuildTronTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  buildTransfer(
    @Body() body: BuildTronTransferRequestDto,
  ): BuildTronTransactionResponseDto {
    return this.tronTransactionService.buildTransfer(body);
  }

  /**
   * Builds a TRON TRX transaction from request parameters.
   * @param body Request payload.
   * @returns Unsigned transaction payload.
   */
  @Post('build-transaction')
  @ApiOperation({
    summary: 'Build TRON TRX transaction from params (unsigned)',
  })
  @ApiBody({ type: BuildTronTransactionRequestDto })
  @ApiResponse({ status: 201, type: BuildTronTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  buildTransaction(
    @Body() body: BuildTronTransactionRequestDto,
  ): BuildTronTransactionResponseDto {
    return this.tronTransactionService.buildTransaction(body);
  }

  /**
   * Signs a TRON transfer from raw JSON.
   * @param body Request payload.
   * @returns Signed transaction response.
   */
  @Post('sign')
  @ApiOperation({ summary: 'Sign TRON transaction or transfer from rawJson' })
  @ApiBody({ type: SignTronRawTransactionRequestDto })
  @ApiResponse({ status: 201, type: SignTronTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  sign(
    @Body() body: SignTronRawTransactionRequestDto,
  ): SignTronTransactionResponseDto {
    return this.tronTransactionService.sign(body);
  }

}
