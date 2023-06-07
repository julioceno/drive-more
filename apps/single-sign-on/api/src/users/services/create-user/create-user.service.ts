import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatedUserEntity } from 'src/users/entities/created-user.entity';
import { generateRandomPassword } from 'src/users/utils';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class CreateUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(dto: CreateUserDto) {
    const { email, name } = dto;

    const userAlreadyExists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new BadRequestException('Usuário já existe.');
    }

    const password = generateRandomPassword(7);

    const passwordEncrypted = bcrypt.hashSync(password, 8);

    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        password: passwordEncrypted,
      },
    });

    const entity = new CreatedUserEntity({ ...user, password });

    return {
      user: entity,
    };
  }
}
