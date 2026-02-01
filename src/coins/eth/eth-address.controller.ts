import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenerateEthAddressRequestDto } from './dto/request/generate-eth-address.request.dto';
import { ValidateEthAddressRequestDto } from './dto/request/validate-eth-address.request.dto';
import { GenerateEthAddressResponseDto } from './dto/response/generate-eth-address.response.dto';
import { ValidateEthAddressResponseDto } from './dto/response/validate-eth-address.response.dto';
import { EthAddressService } from './service/eth-address.service';

type AdminTestResponse = {
  status: 'ok';
};

/**
 * Handles ETH address endpoints.
 */
@ApiTags('ETH Address')
@Controller('api/v1/address/eth')
export class EthAddressController {
  constructor(private readonly ethAddressService: EthAddressService) {}

  /**
   * Generates an ETH address from mnemonic and derivation data.
   * @param body Request payload.
   * @returns Generated address response.
   */
  @Post('generate')
  @ApiOperation({ summary: 'Generate ETH address' })
  @ApiBody({ type: GenerateEthAddressRequestDto })
  @ApiResponse({ status: 201, type: GenerateEthAddressResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  generate(
    @Body() body: GenerateEthAddressRequestDto,
  ): GenerateEthAddressResponseDto {
    return this.ethAddressService.generate(body);
  }

  /**
   * Validates an ETH address.
   * @param body Request payload.
   * @returns Validation result.
   */
  @Post('validate')
  @ApiOperation({ summary: 'Validate ETH address' })
  @ApiBody({ type: ValidateEthAddressRequestDto })
  @ApiResponse({ status: 201, type: ValidateEthAddressResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  validate(
    @Body() body: ValidateEthAddressRequestDto,
  ): ValidateEthAddressResponseDto {
    return this.ethAddressService.validate(body);
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
