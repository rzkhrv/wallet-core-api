import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenerateTronAddressRequestDto } from './dto/request/generate-tron-address.request.dto';
import { ValidateTronAddressRequestDto } from './dto/request/validate-tron-address.request.dto';
import { GenerateTronAddressResponseDto } from './dto/response/generate-tron-address.response.dto';
import { ValidateTronAddressResponseDto } from './dto/response/validate-tron-address.response.dto';
import { TronAddressService } from './service/tron-address.service';

/**
 * Handles TRON address endpoints.
 */
@ApiTags('TRON Address')
@Controller('api/v1/address/tron')
export class TronAddressController {
  constructor(private readonly tronAddressService: TronAddressService) {}

  /**
   * Generates a TRON address from mnemonic and derivation data.
   * @param body Request payload.
   * @returns Generated address response.
   */
  @Post('generate')
  @ApiOperation({ summary: 'Generate TRON address' })
  @ApiBody({ type: GenerateTronAddressRequestDto })
  @ApiResponse({ status: 201, type: GenerateTronAddressResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  generate(
    @Body() body: GenerateTronAddressRequestDto,
  ): GenerateTronAddressResponseDto {
    return this.tronAddressService.generate(body);
  }

  /**
   * Validates a TRON address.
   * @param body Request payload.
   * @returns Validation result.
   */
  @Post('validate')
  @ApiOperation({ summary: 'Validate TRON address' })
  @ApiBody({ type: ValidateTronAddressRequestDto })
  @ApiResponse({ status: 201, type: ValidateTronAddressResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  validate(
    @Body() body: ValidateTronAddressRequestDto,
  ): ValidateTronAddressResponseDto {
    return this.tronAddressService.validate(body);
  }
}
