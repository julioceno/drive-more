import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../services/create-user/dto/create-user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
