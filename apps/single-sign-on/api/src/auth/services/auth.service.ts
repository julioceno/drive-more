import { Injectable } from '@nestjs/common';
import { SignInDto } from './sign-in/dto/sign-in.dto';
import { SignInService } from './sign-in/sign-in.service';

@Injectable()
export class AuthService {
  constructor(private readonly signInService: SignInService) {}

  signIn(dto: SignInDto) {
    return this.signInService.run(dto);
  }
}
