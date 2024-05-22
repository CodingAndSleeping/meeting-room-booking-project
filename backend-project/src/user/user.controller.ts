import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { loginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Get('register/captcha')
  async getCaptcha(@Query('email') email: string) {
    return await this.userService.getCaptcha(email);
  }

  @Post('login')
  async login(@Body() loginUser: loginUserDto) {
    const user = await this.userService.login(loginUser, false);
    return user;
  }
  @Post('admin/login')
  async adminLogin(@Body() loginUser: loginUserDto) {
    const userVo = await this.userService.login(loginUser, true);
    return userVo;
  }

  @Get('init-data')
  initData() {
    this.userService.initData();
  }
}
