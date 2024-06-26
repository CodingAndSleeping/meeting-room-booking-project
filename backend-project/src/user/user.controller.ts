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

import { RequireLogin, UserInfo } from 'src/decorator/custom.decorator';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

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

      const user = await this.userService.findUserById(data.id, true);

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

  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    const user = await this.userService.findUserDetailById(userId);

    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.email = user.email;
    vo.username = user.username;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    vo.nickName = user.nickName;
    vo.createTime = user.createTime;
    vo.isFrozen = user.isFrozen;

    return vo;
  }

  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(userId, passwordDto);
  }

  @Get('update_password/captcha')
  async updatePasswordCaptcha(@Query('email') email: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_password_captcha_${email}`,
      code,
      10 * 60,
    );

    await this.emailService.sendEmail({
      to: email,
      subject: '更改密码验证码',
      html: `<p>你的更改密码验证码是${code}</p>`,
    });

    return '发送成功！';
  }

  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(
    @UserInfo('userId') userId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto);
  }

  @Get('update/captcha')
  async updateCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_user_captcha_${address}`,
      code,
      10 * 60,
    );

    await this.emailService.sendEmail({
      to: address,
      subject: '更改用户信息验证码',
      html: `<p>你的验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @Get('init-data')
  initData() {
    this.userService.initData();
  }
}
