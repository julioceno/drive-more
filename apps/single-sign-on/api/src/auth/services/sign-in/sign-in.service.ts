import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { GenerateTokenService } from '../generate-token/generate-token.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Public, RoleEnum } from '@/common';
import { GenerateRefreshTokenService } from '../generate-refresh-token/generate-refresh-token.service';

@Injectable()
@Public()
export class SignInService {
  private readonly logger = new Logger(`@service/${SignInService.name}`);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly generateTokenService: GenerateTokenService,
    private readonly refreshTokenService: GenerateRefreshTokenService,
  ) {}

  async run({ email, password }: SignInDto) {
    this.logger.log('run SignInService');

    const user = await this.getUser(email);
    this.logger.log(`Get user with id ${user.id}`);

    const isEqualPasswords = bcrypt.compareSync(password, user.password);

    if (!user || !isEqualPasswords) {
      this.logger.log(`User unauthorized`);
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

  private getUser(email: string) {
    return this.prismaService.user.findUniqueOrThrow({
      where: { email },
      include: {
        role: true,
      },
    });
  }
}
