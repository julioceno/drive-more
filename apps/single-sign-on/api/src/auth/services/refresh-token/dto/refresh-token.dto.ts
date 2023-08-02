import { Messages } from '@/common';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: Messages.required('refreshTokenId') })
  @IsUUID(4, { message: Messages.uuid('refreshTokenId') })
  refreshTokenId: string;

  @IsNotEmpty({ message: Messages.required('clientId') })
  @IsUUID(4, { message: Messages.uuid('clientId') })
  clientId: string;
}
