import { Injectable } from "@nestjs/common";
import { Ability, AbilityBuilder } from "@casl/ability";
import { createPrismaAbility, PrismaQuery, Subjects } from "@casl/prisma";
import { Board, User, Workspace, WorkspaceMembership, WorkspaceRole } from "@bola/db";
import { Action } from "src/common/constants";

type AppSubjects = Subjects<{
  User: User;
  Workspace: Workspace;
  WorkspaceMembership: WorkspaceMembership;
  Board: Board;
}>;

type AppAbility = Ability<[Action, AppSubjects], PrismaQuery>;

@Injectable()
export class AbilityFactory {
  createFor(user: User, workspace: Workspace & { membership: WorkspaceMembership }) {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    switch (workspace.membership.role) {
      case WorkspaceRole.OWNER: {
        can(Action.Manage, "Workspace", { id: workspace.id });
        can(Action.Manage, "WorkspaceMembership", { workspaceId: workspace.id });
        can(Action.Manage, "Board", { workspaceId: workspace.id });
        break;
      }
    }

    return build();
  }
}
