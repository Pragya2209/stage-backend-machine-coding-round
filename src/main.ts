import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv'
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  const config = new DocumentBuilder()
    .setTitle('Stage Api docs')
    .setDescription(
      'Have all the routes documentation for user, movies and tvshows',
    )
    .setVersion('1.0')
    .addServer(`http://127.0.0.1:${port}`, 'Default Server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(port);
}
bootstrap();
