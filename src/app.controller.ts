import { Controller, Req, Res, Post, UseGuards, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}
  @Get()
  findAll(@Req() req: Request) {
    return '[Authentication Service] : Hello world !';
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req) {
    return req.user;
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('auth/jwt/login')
  // async loginWithJWT(@Req() req, @Res() res: Response) {
  //   // JWT token
  //   const token = await this.authService.login(req.user);
  //   res.cookie('jwt-token', token, { maxAge: 60, httpOnly: true });
  //   res.send(token);
  // }

  // @UseGuards(LocalAuthGuard)
  // @Post('auth/jwt/login')
  // async login2(@Req() req) {
  //   return req.user;
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Req() req) {
  //   return req.user;
  // }
}
