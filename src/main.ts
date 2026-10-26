import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    method: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // Activate shutdown hooks for proper cleanup
  app.enableShutdownHooks(['SIGTERM', 'SIGINT']);

  //register Guard globally
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Node Prod API')
    .setDescription('API documentation for Node Prod API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
