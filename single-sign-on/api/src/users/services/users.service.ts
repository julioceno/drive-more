import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user/dto/create-user.dto';
import { CreateUserService } from './create-user/create-user.service';
import { UpdateUserDto } from './update-user/dto/update-user.dto';
import { UpdateUserService } from './update-user/update-user.service';
import { FindOneUserService } from './find-one-user/find-one-user.service';
import { FindAllUsersDto } from './find-all-users/dto/find-all-users.dto';
import { FindAllUsersService } from './find-all-users/find-all-users.service';
import { UpdatePasswordUserService } from './update-password-user/update-password-user.service';
import { UpdatePasswordUserDto } from './update-password-user/dto/update-password-user.dto';
import { DeleteUserService } from './delete-user/delete-user.service';
import { ChangeRoleUserDto } from './change-role-user/dto/change-role-user.dto';
import { ChangeRoleUserService } from './change-role-user/change-role-user.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly findAllUsersService: FindAllUsersService,
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly updatePasswordUserService: UpdatePasswordUserService,
    private readonly findOneUserService: FindOneUserService,
    private readonly deleteUserService: DeleteUserService,
    private readonly changeRoleUserService: ChangeRoleUserService,
  ) {}

  create(creatorEmail: string, dto: CreateUserDto) {
    return this.createUserService.run(creatorEmail, dto);
  }

  findAll(dto: FindAllUsersDto) {
    return this.findAllUsersService.run(dto);
  }

  findOne(id: string) {
    return this.findOneUserService.run(id);
  }

  update(userId: string, dto: UpdateUserDto) {
    return this.updateUserService.run(userId, dto);
  }

  updatePassword(userId: string, dto: UpdatePasswordUserDto) {
    return this.updatePasswordUserService.run(userId, dto);
  }

  delete(id: string, creatorEmail: string) {
    return this.deleteUserService.run(id, creatorEmail);
  }

  changeRole(creatorEmail: string, dto: ChangeRoleUserDto) {
    return this.changeRoleUserService.run(creatorEmail, dto);
  }
}
