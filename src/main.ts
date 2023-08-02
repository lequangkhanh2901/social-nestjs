import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Social')
    .setDescription('The social API description')
    .setVersion('1.0')
    .addTag('Social')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config, {})
  SwaggerModule.setup('docs', app, document)

  await app.listen(4000)
}
bootstrap()
