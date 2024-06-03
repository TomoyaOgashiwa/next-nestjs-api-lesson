import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { Request } from 'express';
import * as cookieParser from 'cookie-parser';
// import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // DTOとクラスのバリデーションを有効化するために必要
  // whitelist: trueはDTOで定義していない値が送られてきたときにその値を省いてくれるもの
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // CORS設定
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
  });

  app.use(cookieParser());
  await app.listen(3005);
}
bootstrap();
