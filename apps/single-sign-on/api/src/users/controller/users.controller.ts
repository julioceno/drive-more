import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto } from '../services/create-user/dto/create-user.dto';
import { UpdateUserDto } from '../services/update-user/dto/update-user.dto';
import { UsersService } from '../services/users.service';
import { FindAllUsersDto } from '../services/find-all-users/dto/find-all-users.dto';
import { AuthorizedUser } from '@/common';

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
  update(@AuthorizedUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(userId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
