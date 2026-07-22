import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({ origin: configService.getOrThrow("CLIENT_URL"), credentials: true });
  app.setGlobalPrefix("api");
  app.use(cookieParser());

  await app.listen(configService.get("PORT", 4000));
}
bootstrap();
