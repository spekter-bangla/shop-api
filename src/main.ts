import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
