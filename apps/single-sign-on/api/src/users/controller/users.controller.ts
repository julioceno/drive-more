import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../services/create-user/dto/create-user.dto';
import { UsersService } from '../services/users.service';
import { Public } from '@/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
