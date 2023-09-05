import { PrismaService } from '@/prisma/prisma.service';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '@/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { User } from '@prisma/client';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';

@Injectable()
export class UpdatePasswordUserService {
  private readonly logger = new Logger(
    `@service/${UpdatePasswordUserService.name}`,
  );

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(id: string, dto: UpdatePasswordUserDto) {
    const user = await this.getUser(id);

    if (!user) {
      throw new NotFoundException('Usuário não existe.');
    }

    this.validatePassword(dto.currentPassword, user.password);

    const updatedUser = await this.updatePassword(id, dto.password);

    this.createRecordHistory(updatedUser);

    return new UserEntity(updatedUser);
  }

  private getUser(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  private updatePassword(id: string, password: string) {
    const passwordEncrypted = bcrypt.hashSync(password, 8);

    return this.prismaService.user.update({
      where: { id },
      data: { password: passwordEncrypted },
    });
  }

  private validatePassword(password: string, entityPassword: string) {
    const isEqualPasswords = bcrypt.compareSync(password, entityPassword);

    if (!isEqualPasswords) {
      throw new UnauthorizedException();
    }
  }

  private async createRecordHistory(user: User) {
    const message = `Password from user ${user.email} is modified`;

    return this.systemHistoryProxyService
      .createRecordCustom({
        action: ActionEnum.UPDATE,
        creatorEmail: user.email,
        entityId: user.codigo,
        payload: message,
        resourceName: Resources.USER,
      })
      .catch((err) => this.logger.error(`There was as error ${err}`));
  }
}
