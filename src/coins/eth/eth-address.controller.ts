import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenerateEthAddressRequestDto } from './dto/request/generate-eth-address.request.dto';
import { ValidateEthAddressRequestDto } from './dto/request/validate-eth-address.request.dto';
import { GenerateEthAddressResponseDto } from './dto/response/generate-eth-address.response.dto';
import { ValidateEthAddressResponseDto } from './dto/response/validate-eth-address.response.dto';
import { EthAddressService } from './service/eth-address.service';

@ApiTags('ETH Address')
@Controller('api/v1/address/eth')
export class EthAddressController {
  constructor(private readonly ethAddressService: EthAddressService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate ETH address' })
  @ApiBody({ type: GenerateEthAddressRequestDto })
  @ApiResponse({ status: 200, type: GenerateEthAddressResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  generate(
    @Body() body: GenerateEthAddressRequestDto,
  ): GenerateEthAddressResponseDto {
    return this.ethAddressService.generate(body);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate ETH address' })
  @ApiBody({ type: ValidateEthAddressRequestDto })
  @ApiResponse({ status: 200, type: ValidateEthAddressResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  validate(
    @Body() body: ValidateEthAddressRequestDto,
  ): ValidateEthAddressResponseDto {
    return this.ethAddressService.validate(body);
  }
}
