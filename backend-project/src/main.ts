import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './interceptor/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor';
import { UnloginFilter } from './exception/unlogin.filter';
import { CustomExceptionFilter } from './exception/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局启用验证管道
  app.useGlobalPipes(new ValidationPipe());

  // 全局启用拦截器
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  app.useGlobalFilters(new CustomExceptionFilter());

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest.server.port'));
}
bootstrap();
