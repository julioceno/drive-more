import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from '../services/create-user/dto/create-user.dto';
import { UpdateUserDto } from '../services/update-user/dto/update-user.dto';
import { UsersService } from '../services/users.service';
import { FindAllUsersDto } from '../services/find-all-users/dto/find-all-users.dto';
import { AuthorizedUser, Role } from '@/common';
import { UpdatePasswordUserDto } from '../services/update-password-user/dto/update-password-user.dto';
import { ChangeRoleUserDto } from '../services/change-role-user/dto/change-role-user.dto';
import { RoleEnum } from 'dirigir-more-utils';

@Role(RoleEnum.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: FindAllUsersDto) {
    return this.usersService.findAll(query);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Put()
  @Role(RoleEnum.USER)
  update(@AuthorizedUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(userId, dto);
  }

  @Patch('/password')
  @Role(RoleEnum.USER)
  updatePassword(
    @AuthorizedUser('id') userId: string,
    @Body() dto: UpdatePasswordUserDto,
  ) {
    return this.usersService.updatePassword(userId, dto);
  }

  @Patch('/change-role')
  changeRole(@Body() dto: ChangeRoleUserDto) {
    return this.usersService.changeRole(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
