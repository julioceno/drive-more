import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from '../services/create-user/dto/create-user.dto';
import { UpdateUserDto } from '../services/update-user/dto/update-user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Put()
  update(@Body() dto: UpdateUserDto) {
    return this.usersService.update(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
