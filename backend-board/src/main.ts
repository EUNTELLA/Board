import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);


    app.enableCors({
        origin: 'http://localhost:3000',  // 프론트엔드 주소
        credentials: true,
    });


    const config = new DocumentBuilder()
        .setTitle('Board API')
        .setDescription('게시판 API 문서')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(3001);

    console.log('서버 실행: http://localhost:3001');
    console.log('API 문서: http://localhost:3001/docs');
}
bootstrap();