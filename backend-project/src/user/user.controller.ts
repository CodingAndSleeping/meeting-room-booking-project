import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { generateToken } from './utils/generateToken';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Get('register-captcha')
  async getCaptcha(@Query('email') email: string) {
    return await this.userService.getCaptcha(email);
  }

  @Post('login')
  async login(@Body() loginUser: loginUserDto) {
    const loginUserVo = await this.userService.login(loginUser, false);

    const { accessToken, refreshToken } = generateToken(
      loginUserVo.userInfo,
      this.jwtService,
      this.configService.get('jwt.access_token_expires_time'),
      this.configService.get('jwt.refresh_token_expires_time'),
    );

    loginUserVo.accessToken = accessToken;
    loginUserVo.refreshToken = refreshToken;

    return loginUserVo;
  }
  @Post('admin/login')
  async adminLogin(@Body() loginUser: loginUserDto) {
    const loginUserVo = await this.userService.login(loginUser, true);

    const { accessToken, refreshToken } = generateToken(
      loginUserVo.userInfo,
      this.jwtService,
      this.configService.get('jwt.access_token_expires_time'),
      this.configService.get('jwt.refresh_token_expires_time'),
    );

    loginUserVo.accessToken = accessToken;
    loginUserVo.refreshToken = refreshToken;

    return loginUserVo;
  }

  @Get('refresh')
  async refreshToken(@Query('refreshToken') rt: string) {
    try {
      const data = this.jwtService.verify(rt);

      const user = await this.userService.findUserById(data.id, false);

      const { accessToken, refreshToken } = generateToken(
        user,
        this.jwtService,
        this.configService.get('jwt.access_token_expires_time'),
        this.configService.get('jwt.refresh_token_expires_time'),
      );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('token已失效, 请重新登陆！');
    }
  }

  @Get('admin/refresh')
  async adminRefreshToken(@Query('refreshToken') rt: string) {
    try {
      const data = this.jwtService.verify(rt);

      const user = await this.userService.findUserById(data.id, false);

      const { accessToken, refreshToken } = generateToken(
        user,
        this.jwtService,
        this.configService.get('jwt.access_token_expires_time'),
        this.configService.get('jwt.refresh_token_expires_time'),
      );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('token已失效, 请重新登陆！');
    }
  }

  @Get('init-data')
  initData() {
    this.userService.initData();
  }
}
