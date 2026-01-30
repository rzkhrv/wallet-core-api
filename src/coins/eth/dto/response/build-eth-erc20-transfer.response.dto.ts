import { ApiProperty } from '@nestjs/swagger';

export class BuildEthErc20TransferResponseDto {
  @ApiProperty({
    example:
      '0a020801120208001a0208c8220210e0292a2a307861306238363939316336323138623336633164313964346132653965623063653336303665623438320d0a0b1a090a0708a0bcf4c004',
    description: 'Signing payload from build step (hex)',
  })
  payload: string;
}
