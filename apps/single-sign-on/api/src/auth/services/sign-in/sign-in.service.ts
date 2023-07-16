import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GenerateTokenService } from '../generate-token/generate-token.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Public, RoleEnum } from '@/common';
import { GenerateRefreshTokenService } from '../generate-refresh-token/generate-refresh-token.service';

@Injectable()
@Public()
export class SignInService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly generateTokenService: GenerateTokenService,
    private readonly refreshTokenService: GenerateRefreshTokenService,
  ) {}

  async run({ email, password }: SignInDto) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { email },
      include: {
        role: true,
      },
    });

    const isEqualPasswords = bcrypt.compareSync(password, user.password);

    if (!user || !isEqualPasswords) {
      throw new UnauthorizedException();
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateTokenService.run({
        id: user.id,
        role: user.role.name as RoleEnum,
      }),
      this.refreshTokenService.run(user.id),
    ]);

    return { accessToken, refreshToken };
  }
}
