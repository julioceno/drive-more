import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { generateRandomPassword } from '../../utils';
import { CreateUserDto } from './dto/create-user.dto';
import { CreatedUserEntity } from '../../entities/created-user.entity';
import { RoleEnum } from 'dirigir-more-utils';

@Injectable()
export class CreateUserService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly DEFAULT_ROLE = RoleEnum.USER;

  async run(dto: CreateUserDto) {
    const { email } = dto;

    await this.checkUserExists(email);

    const password = generateRandomPassword(7);
    const passwordEncrypted = bcrypt.hashSync(password, 8);

    const user = await this.createUser(dto, passwordEncrypted);
    return new CreatedUserEntity({ ...user, password });
  }

  private async checkUserExists(email: string) {
    const userAlreadyExists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new BadRequestException('Usuário já existe.');
    }
  }

  private async createUser(dto: CreateUserDto, passwordEncrypted: string) {
    const { email, name } = dto;

    const { id: roleId } = await this.getDefaultRole();

    return this.prismaService.user.create({
      data: {
        email,
        name,
        password: passwordEncrypted,
        roleId,
      },
    });
  }

  private getDefaultRole() {
    return this.prismaService.role.findUniqueOrThrow({
      where: {
        name: this.DEFAULT_ROLE,
      },
    });
  }
}
