import { Controller, Req, Res, Post, UseGuards, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';

import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @MessagePattern('AUTH_valid_user')
  async vallidUser(data: any): Promise<any> {
    try {
      const user = await this.authService.validJwtTokenAndUser(data.token);
      return user.id === data.user ? user : false;
    } catch (error) {
      return false;
    }
  }

  @MessagePattern('AUTH_get_user_relation')
  async getUserRelation(ids: string[]): Promise<any> {
    try {
      const result = this.userService.findByIds(ids);
      return result;
    } catch (error) {
      return false;
    }
  }

  @Get()
  test(@Req() req: Request) {
    return '[Authentication Service] : OK!';
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/jwt/login')
  async loginWithJWT(@Req() req, @Res() res: Response) {
    // JWT token
    const token = await this.authService.login(req.user);

    // Set cookie
    // res.cookie('jwt-token', token, {
    //   maxAge: 600000,
    //   httpOnly: true,
    //   sameSite: true,
    // });

    res.json({
      token,
      user: req.user,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  getUserData(@Req() req, @Res() res: Response) {
    return res.json({
      user: req.user,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
