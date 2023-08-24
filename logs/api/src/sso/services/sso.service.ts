import { Injectable } from '@nestjs/common';
import { VerifyTokenService } from './verify-token/verify-token.service';
import { VerifyTokenDto } from './verify-token/dto/verify-token.dto';

@Injectable()
export class SsoService {
  constructor(private readonly verifyTokenService: VerifyTokenService) {}

  verifyToken(dto: VerifyTokenDto) {
    return this.verifyTokenService.run(dto);
  }
}
