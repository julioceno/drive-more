import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user/dto/create-user.dto';
import { CreateUserService } from './create-user/create-user.service';

@Injectable()
export class UsersService {
  constructor(private readonly createUserService: CreateUserService) {}

  create(dto: CreateUserDto) {
    return this.createUserService.run(dto);
  }
}
