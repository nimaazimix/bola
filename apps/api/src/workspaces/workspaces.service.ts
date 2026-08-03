import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, PrismaService, User, WorkspaceRole } from "src/prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto";
import { WorkspaceErrors } from "./errors";

@Injectable()
export class WorkspacesService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateWorkspaceDto, user: User) {
    try {
      const { memberships, ...workspaceFields } = await this.prismaService.workspace.create({
        data: {
          ...dto,
          memberships: {
            create: { role: WorkspaceRole.OWNER, user: { connect: { id: user.id } } },
          },
        },
        include: { memberships: { where: { userId: user.id } } },
      });

      return {
        ...workspaceFields,
        membership: { role: memberships[0]!.role },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException(WorkspaceErrors.SLUG_ALREADY_IN_USE);
      }
      throw error;
    }
  }

  async findAll(user: User) {
    const workspaces = await this.prismaService.workspace.findMany({
      where: { memberships: { some: { userId: user.id } } },
      include: { memberships: { where: { userId: user.id } } },
      orderBy: { createdAt: "desc" },
    });

    return workspaces.map(({ memberships, ...workspaceFields }) => ({
      ...workspaceFields,
      membership: { role: memberships[0]!.role },
    }));
  }

  async checkSlugAvailability(slug: string) {
    const workspace = await this.prismaService.workspace.findUnique({ where: { slug } });

    return { available: !workspace };
  }

  async findOneBySlug(slug: string, user: User) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: { slug },
      include: { memberships: { where: { userId: user.id } } },
    });

    if (!workspace) {
      throw new NotFoundException(WorkspaceErrors.NOT_FOUND);
    }

    const { memberships, ...workspaceFields } = workspace;

    if (!memberships[0]) {
      throw new ForbiddenException(WorkspaceErrors.ACCESS_DENIED);
    }

    return {
      ...workspaceFields,
      membership: { role: memberships[0].role },
    };
  }
}
