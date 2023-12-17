import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FileModule } from '@src/file.module';
import mongoose from 'mongoose';

const fileServicePort = Number(process.env.FILE_SERVICE_PORT);

async function bootstrap() {
  const app = await NestFactory.create(FileModule);

  const config = new DocumentBuilder()
    .setTitle('File serivce API')
    .setDescription('File service api')
    .addTag('file', 'File service API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await mongoose.connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
    { dbName: process.env.MONGO_DATABASE },
  );
  await app.listen(fileServicePort);
}
bootstrap();
