import { Controller, Body, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { UserService } from './user.service';

// UseGuards(AuthGuard)で認証関係のプロテクトをしている 今回はjwtを指定してガードしている
// ただし、jwtがHeaderに含まれたり、今回のようにcookieに含まれたりと様々な場合があるのでjwtStrategyファイルを作成してカスタマイズする
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getLoginUser(@Req() req: Request): Omit<User, 'hashedPassword'> {
    return req.user;
  }

  @Patch()
  updateUser(
    @Req() req: Request,
    @Body() dto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    return this.userService.updateUser(req.user.id, dto);
  }
}
