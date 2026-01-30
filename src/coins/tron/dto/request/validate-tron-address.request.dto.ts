import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase58,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class ValidateTronAddressRequestDto {
  @ApiProperty({
    example: 'TQJ8YqK9m5frpB1bYwQZ8VJ2G2R9o2k5G6',
    description: 'TRON address to validate',
  })
  @IsBase58()
  @Length(34, 34)
  @Matches(/^T/)
  @IsString()
  @IsNotEmpty()
  address: string;
}
