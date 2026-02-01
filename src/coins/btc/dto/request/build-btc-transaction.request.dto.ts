import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Validate,
  ValidateNested,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BtcUtxoRequestDto } from './btc-utxo.request.dto';
import { BtcOutputRequestDto } from './btc-output.request.dto';

@ValidatorConstraint({ name: 'BtcOutputsValidator', async: false })
class BtcOutputsValidator implements ValidatorConstraintInterface {
  validate(outputs: BtcOutputRequestDto[] | undefined): boolean {
    if (!outputs || outputs.length === 0) {
      return false;
    }
    const changeCount = outputs.filter((output) => output.isChange).length;
    const recipientCount = outputs.filter((output) => !output.isChange).length;
    return changeCount === 1 && recipientCount > 0;
  }

  defaultMessage(): string {
    return 'BTC outputs must include exactly one change output and at least one recipient';
  }
}

export class BuildBtcTransactionRequestDto {
  @ApiProperty({
    type: [BtcOutputRequestDto],
    description:
      'List of transaction outputs, including exactly one change output (isChange=true)',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BtcOutputRequestDto)
  @Validate(BtcOutputsValidator)
  outputs: BtcOutputRequestDto[];

  @ApiProperty({ example: '10', description: 'Fee per byte in satoshis' })
  @IsNumberString({ no_symbols: true })
  @IsString()
  @IsNotEmpty()
  byteFee: string;

  @ApiProperty({
    type: [BtcUtxoRequestDto],
    description: 'List of UTXOs to spend',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BtcUtxoRequestDto)
  utxos: BtcUtxoRequestDto[];
}
