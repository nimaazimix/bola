import { Module } from "@nestjs/common";
import { AppProviders } from "./app.providers";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { MailModule } from "./mail/mail.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  providers: AppProviders,
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, MailModule, AuthModule],
})
export class AppModule {}
