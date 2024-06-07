import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { UserInfo } from './decorator/custom.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Get('hello')
  getHello(@UserInfo('username') username: string): string {
    console.log(username);
    return this.appService.getHello();
  }
}
