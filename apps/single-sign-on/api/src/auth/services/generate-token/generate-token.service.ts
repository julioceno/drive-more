import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadProps } from './types';

@Injectable()
export class GenerateTokenService {
  constructor(private jwtService: JwtService) {}

  run(payload: PayloadProps) {
    return this.jwtService.signAsync(payload);
  }
}
