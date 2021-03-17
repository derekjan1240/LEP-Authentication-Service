import { Controller, Req, Res, Post, UseGuards, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}
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
