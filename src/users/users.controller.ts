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
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './schemas/users.schema';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  public async findAll(): Promise<User[]> {
    return await this.usersService.findUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  public async find(@Req() req, @Res() res: Response) {
    const User = await this.usersService.findOneById(req.user.userId);
    res.json({
      user: User.toJson(),
    });
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

  @UseGuards(JwtAuthGuard)
  @Put()
  public async update(
    @Req() req,
    @Body() dto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const User = await this.usersService.updateUser(req.user.userId, dto);
    res.json({
      user: User.toJson(),
    });
  }
}
