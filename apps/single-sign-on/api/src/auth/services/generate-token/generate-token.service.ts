import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GenerateTokenService {
  constructor(private jwtService: JwtService) {}

  run(payload: { sub: string; email: string }) {
    return this.jwtService.signAsync(payload);
  }
}
