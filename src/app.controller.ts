import {
  Controller,
  Req,
  Res,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
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
      const payloadUser = await this.authService.validJwtTokenAndUser(
        data.token,
      );
      // 雙重驗證
      if (payloadUser.id !== data.user) {
        return false;
      }

      const user = await this.userService.findOneById(payloadUser.id);
      return user.id === data.user
        ? {
            ...user.toJson(),
            _id: user._id.toString(),
          }
        : false;
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

  /* 實驗用 API */

  // 驗證身分
  @Post('test/valid/user')
  public async validUser(@Body() body: any) {
    try {
      const payloadUser = await this.authService.validJwtTokenAndUser(
        body.data.token,
      );
      console.log(payloadUser);
      // 雙重驗證
      if (payloadUser.id !== body.data.user) {
        return false;
      }

      const user = await this.userService.findOneById(payloadUser.id);
      return user.id === body.data.user
        ? {
            ...user.toJson(),
            _id: user._id.toString(),
          }
        : false;
    } catch (error) {
      return false;
    }
  }

  // 取的 Users 資料
  @Post('test/relation/user')
  public async relationUsers(@Body() body: any) {
    try {
      const result = this.userService.findByIds(body.data.ids);
      return result;
    } catch (error) {
      return false;
    }
  }
}
