import { Module } from "@nestjs/common";
import { AppProviders } from "./app.providers";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { CaslModule } from "./casl/casl.module";
import { MailModule } from "./mail/mail.module";
import { AuthModule } from "./auth/auth.module";
import { WorkspacesModule } from "./workspaces/workspaces.module";
import { BoardsModule } from "./boards/boards.module";

@Module({
  providers: AppProviders,
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CaslModule,
    MailModule,
    AuthModule,
    WorkspacesModule,
    BoardsModule,
  ],
})
export class AppModule {}
