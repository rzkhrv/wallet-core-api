import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenerateBtcAddressRequestDto } from './dto/request/generate-btc-address.request.dto';
import { ValidateBtcAddressRequestDto } from './dto/request/validate-btc-address.request.dto';
import { GenerateBtcAddressResponseDto } from './dto/response/generate-btc-address.response.dto';
import { ValidateBtcAddressResponseDto } from './dto/response/validate-btc-address.response.dto';
import { BtcAddressService } from './service/btc-address.service';

@ApiTags('BTC Address')
@Controller('api/v1/address/btc')
export class BtcAddressController {
  constructor(private readonly btcAddressService: BtcAddressService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate BTC address' })
  @ApiBody({ type: GenerateBtcAddressRequestDto })
  @ApiResponse({ status: 200, type: GenerateBtcAddressResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  generate(
    @Body() body: GenerateBtcAddressRequestDto,
  ): GenerateBtcAddressResponseDto {
    return this.btcAddressService.generate(body);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate BTC address' })
  @ApiBody({ type: ValidateBtcAddressRequestDto })
  @ApiResponse({ status: 200, type: ValidateBtcAddressResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  validate(
    @Body() body: ValidateBtcAddressRequestDto,
  ): ValidateBtcAddressResponseDto {
    return this.btcAddressService.validate(body);
  }
}
