import { IAuthorizedUser } from '@/common/interfaces';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GenerateTokenService {
  constructor(private jwtService: JwtService) {}

  run(payload: IAuthorizedUser) {
    return this.jwtService.signAsync(payload);
  }
}
