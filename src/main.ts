import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )
  const configService = app.get(ConfigService)

  const config = new DocumentBuilder()
    .setTitle('Social')
    .setDescription('The social API description')
    .setVersion('1.0')
    .addTag('Social')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config, {})
  SwaggerModule.setup('docs', app, document)

  await app.listen(configService.get('PORT'), () => {
    // eslint-disable-next-line
    console.log(`started at: http://localhost:${configService.get('PORT')}`)
  })
}
bootstrap()
