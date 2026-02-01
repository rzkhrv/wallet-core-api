import { ApiProperty } from '@nestjs/swagger';

export class BuildTronTransactionResponseDto {
  @ApiProperty({
    example:
      '{"transfer":{"ownerAddress":"...","toAddress":"...","amount":"1"},"timestamp":"1738253400000","expiration":"1738253460000"}',
  })
  rawJson: string;
}
