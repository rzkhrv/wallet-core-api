import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BuildTronTransactionRequestDto } from './dto/request/build-tron-transaction.request.dto';
import { BuildTronTransactionResponseDto } from './dto/response/build-tron-transaction.response.dto';
import { TronTransactionService } from './service/tron-transaction.service';

@ApiTags('TRON Transaction')
@Controller('api/v1/transaction/tron')
export class TronTransactionController {
  constructor(
    private readonly tronTransactionService: TronTransactionService,
  ) {}

  @Post('build-transfer')
  @ApiOperation({ summary: 'Build and sign TRON transfer from rawJson' })
  @ApiBody({ type: BuildTronTransactionRequestDto })
  @ApiResponse({ status: 200, type: BuildTronTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  buildTransfer(
    @Body() body: BuildTronTransactionRequestDto,
  ): BuildTronTransactionResponseDto {
    return this.tronTransactionService.buildTransfer(body);
  }

  @Post('build-transaction')
  @ApiOperation({ summary: 'Build and sign TRON transaction from rawJson' })
  @ApiBody({ type: BuildTronTransactionRequestDto })
  @ApiResponse({ status: 200, type: BuildTronTransactionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  buildTransaction(
    @Body() body: BuildTronTransactionRequestDto,
  ): BuildTronTransactionResponseDto {
    return this.tronTransactionService.buildTransaction(body);
  }
}
