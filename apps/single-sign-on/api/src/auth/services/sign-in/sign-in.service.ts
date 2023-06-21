import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GenerateTokenService } from '../generate-token/generate-token.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SignInService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly generateTokenService: GenerateTokenService,
  ) {}

  async run({ email, password }: SignInDto) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { email },
    });

    const isEqualPasswords = bcrypt.compareSync(password, user.password);

    if (!user || !isEqualPasswords) {
      throw new UnauthorizedException();
    }

    const access_token = await this.generateTokenService.run({
      id: user.id,
    });

    return { access_token };
  }
}
