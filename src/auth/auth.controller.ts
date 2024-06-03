import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
  Req,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: AuthDto): Promise<Msg> {
    return this.authService.signUp(dto);
  }

  // Postメソッドは常にCreate成功時の201が返ってくるのでHttpCode(status番号)で変更することが可能
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    // passthrough: trueにするとNestJsでStandardモードである返り値をJSON化してくれる機能がそのまま引き継げる
    // ExpressのResponseを記載するとStandardモードが無効化になるのでpassthroughが必要な場合は記載が必要
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    const jwt = await this.authService.login(dto);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false, // ここをtrueにするとhttpsでの通信が必要になるのでローカル確認する場合はfalseにしておく
      sameSite: 'none',
      path: '/',
    });
    return {
      message: 'ok',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Msg {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: false, // ここをtrueにするとhttpsでの通信が必要になるのでローカル確認する場合はfalseにしておく
      sameSite: 'none',
      path: '/',
    });
    return {
      message: 'ok',
    };
  }
}
