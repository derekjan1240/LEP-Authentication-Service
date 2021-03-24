import {
  Controller,
  Req,
  Res,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/users.schema';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  public async find(): Promise<User[]> {
    return await this.usersService.findUsers();
  }

  @Post()
  public async create(@Body() dto: CreateUserDto, @Res() res: Response) {
    const User = await this.usersService.createUser(dto);
    const token = await this.authService.login(User);

    res.json({
      token,
      user: User,
    });
  }
}
