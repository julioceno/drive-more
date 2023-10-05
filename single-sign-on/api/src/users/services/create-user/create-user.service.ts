import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { generateRandomPassword } from '../../utils';
import { CreateUserDto } from './dto/create-user.dto';
import { CreatedUserEntity } from '../../entities/created-user.entity';
import { Resources, RoleEnum } from '@/common';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { User } from '@prisma/client';
import { ActionEnum } from '@/system-history/interface/system-history.interface';

@Injectable()
export class CreateUserService {
  private readonly logger = new Logger(`@services/${CreateUserService.name}`);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  private readonly DEFAULT_ROLE = RoleEnum.USER;

  async run(dto: CreateUserDto) {
    const { email } = dto;

    await this.checkUserExists(email);

    const password = generateRandomPassword(7);
    const passwordEncrypted = bcrypt.hashSync(password, 8);

    const user = await this.createUser(dto, passwordEncrypted);

    this.createRecordHistory(user);
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

  private async createRecordHistory(user: User) {
    return this.systemHistoryProxyService
      .createRecordStandard(
        user.email /** TODO: creator emails is incorrect */,
        ActionEnum.CREATE,
        user,
        Resources.USER,
      )
      .catch((err) => this.logger.error(`There was as error ${err}`));
  }
}
