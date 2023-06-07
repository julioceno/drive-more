import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { generateRandomPassword } from 'src/users/utils';
import { GenerateTokenService } from 'src/auth/services/generate-token/generate-token.service';

@Injectable()
export class CreateUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(dto: CreateUserDto) {
    const { email, name } = dto;

    const userAlreadyExists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      new BadRequestException('Usuário já existe.');
    }

    const password = generateRandomPassword(7);

    const passwordEncrypted = bcrypt.hashSync(password, 8);

    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        password,
      },
    });

    return {
      user,
    };
  }
}
