import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user/dto/create-user.dto';
import { CreateUserService } from './create-user/create-user.service';
import { UpdateUserDto } from './update-user/dto/update-user.dto';
import { UpdateUserService } from './update-user/update-user.service';
import { FindOneUserService } from './find-one-user/find-one-user.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly findOneUserService: FindOneUserService,
  ) {}

  create(dto: CreateUserDto) {
    return this.createUserService.run(dto);
  }

  findOne(id: string) {
    return this.findOneUserService.run(id);
  }

  update(dto: UpdateUserDto) {
    return this.updateUserService.run(dto);
  }
}
