import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BuildTronTransactionRequestDto } from './dto/request/build-tron-transaction.request.dto';
import { SignTronRawTransactionRequestDto } from './dto/request/sign-tron-raw-transaction.request.dto';
import { BuildTronTransactionResponseDto } from './dto/response/build-tron-transaction.response.dto';
import { SignTronTransactionResponseDto } from './dto/response/sign-tron-transaction.response.dto';
import { TronTransactionService } from './service/tron-transaction.service';

@ApiTags('TRON Transaction')
@Controller('api/v1/transaction/tron')
export class TronTransactionController {
  constructor(
    private readonly tronTransactionService: TronTransactionService,
  ) {}

  @Post('build-transfer')
  @ApiOperation({ summary: 'Build TRON transfer from params (unsigned)' })
  @ApiBody({ type: BuildTronTransactionRequestDto })
  @ApiResponse({ status: 200, type: BuildTronTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  buildTransfer(
    @Body() body: BuildTronTransactionRequestDto,
  ): BuildTronTransactionResponseDto {
    return this.tronTransactionService.buildTransfer(body);
  }

  @Post('build-transaction')
  @ApiOperation({ summary: 'Build TRON transaction from params (unsigned)' })
  @ApiBody({ type: BuildTronTransactionRequestDto })
  @ApiResponse({ status: 200, type: BuildTronTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  buildTransaction(
    @Body() body: BuildTronTransactionRequestDto,
  ): BuildTronTransactionResponseDto {
    return this.tronTransactionService.buildTransaction(body);
  }

  @Post('sign-transfer')
  @ApiOperation({ summary: 'Sign TRON transfer from rawJson' })
  @ApiBody({ type: SignTronRawTransactionRequestDto })
  @ApiResponse({ status: 200, type: SignTronTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  signRawTransfer(
    @Body() body: SignTronRawTransactionRequestDto,
  ): SignTronTransactionResponseDto {
    return this.tronTransactionService.signRawTransfer(body);
  }

  @Post('sign-transaction')
  @ApiOperation({ summary: 'Sign TRON transaction from rawJson' })
  @ApiBody({ type: SignTronRawTransactionRequestDto })
  @ApiResponse({ status: 200, type: SignTronTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  signRawTransaction(
    @Body() body: SignTronRawTransactionRequestDto,
  ): SignTronTransactionResponseDto {
    return this.tronTransactionService.signRawTransaction(body);
  }
}
