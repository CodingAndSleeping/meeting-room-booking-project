import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './interceptor/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor';
import { CustomExceptionFilter } from './exception/custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局启用验证管道
  app.useGlobalPipes(new ValidationPipe());

  // 全局启用拦截器
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  // 全局启用异常过滤器
  app.useGlobalFilters(new CustomExceptionFilter());

  // 跨域
  app.enableCors();

  // 启用 Swagger
  const config = new DocumentBuilder()
    .setTitle('会议室预订系统')
    .setDescription('API 接口文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  // 读取配置文件
  const configService = app.get(ConfigService);

  await app.listen(configService.get('nest.server.port'));
}
bootstrap();
