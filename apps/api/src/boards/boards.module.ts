import { Module } from "@nestjs/common";
import { WorkspacesModule } from "src/workspaces/workspaces.module";
import { BoardsController } from "./boards.controller";
import { BoardsService } from "./boards.service";

@Module({
  imports: [WorkspacesModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
