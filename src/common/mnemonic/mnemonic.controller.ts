import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenerateMnemonicRequestDto } from './dto/request/generate-mnemonic.request.dto';
import { ValidateMnemonicRequestDto } from './dto/request/validate-mnemonic.request.dto';
import { GenerateMnemonicResponseDto } from './dto/response/generate-mnemonic.response.dto';
import { ValidateMnemonicResponseDto } from './dto/response/validate-mnemonic.response.dto';
import { MnemonicService } from './mnemonic.service';

/**
 * Handles mnemonic generation and validation endpoints.
 */
@ApiTags('Mnemonic')
@Controller('api/v1/mnemonic')
export class MnemonicController {
  constructor(private readonly mnemonicService: MnemonicService) {}

  /**
   * Generates a mnemonic phrase for a given strength.
   * @param body Request payload.
   * @returns Generated mnemonic response.
   */
  @Post('generate')
  @ApiOperation({ summary: 'Generate mnemonic' })
  @ApiBody({ type: GenerateMnemonicRequestDto })
  @ApiResponse({ status: 201, type: GenerateMnemonicResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  generate(
    @Body() body: GenerateMnemonicRequestDto,
  ): GenerateMnemonicResponseDto {
    return this.mnemonicService.generate(body);
  }

  /**
   * Validates a mnemonic phrase.
   * @param body Request payload.
   * @returns Validation result.
   */
  @Post('validate')
  @ApiOperation({ summary: 'Validate mnemonic' })
  @ApiBody({ type: ValidateMnemonicRequestDto })
  @ApiResponse({ status: 201, type: ValidateMnemonicResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  validate(
    @Body() body: ValidateMnemonicRequestDto,
  ): ValidateMnemonicResponseDto {
    return this.mnemonicService.validate(body);
  }
}
