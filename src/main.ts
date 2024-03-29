import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('ADEGO Auth')
        .setDescription('ADEGO 인증 API 서버')
        .setVersion('1.0.0')
        .addTag('swagger')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );

    await app.listen(3000);
}
bootstrap();
