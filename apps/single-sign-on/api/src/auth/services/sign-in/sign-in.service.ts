import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenerateTokenService } from '../generate-token/generate-token.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class SignInService {
  constructor(
    private prismaService: PrismaService,
    private generateTokenService: GenerateTokenService,
  ) {}

  async run({ email, password }: SignInDto) {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    const isEqualPasswords = bcrypt.compareSync(password, user.password);

    if (!user || !isEqualPasswords) {
      throw new UnauthorizedException();
    }

    const access_token = await this.generateTokenService.run({
      email,
      sub: user.id,
    });

    return { access_token };
  }
}
