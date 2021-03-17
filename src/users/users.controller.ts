import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async find(): Promise<UserDto[]> {
    return await this.usersService.findUsers();
  }

  @Post()
  public async create(@Body() dto: CreateUserDto): Promise<String> {
    return this.usersService.createUser(dto);
  }
}
