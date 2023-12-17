import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from '@src/user.module';
import mongoose from 'mongoose';

const userServicePort = Number(process.env.USER_SERVICE_PORT);

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  const config = new DocumentBuilder()
    .setTitle('User serivce API')
    .setDescription('User service api')
    .addTag('user', 'User service API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await mongoose.connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
    { dbName: process.env.MONGO_DATABASE },
  );
  await app.listen(userServicePort);
}
bootstrap();
