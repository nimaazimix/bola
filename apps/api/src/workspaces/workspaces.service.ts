import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, PrismaService, User, WorkspaceRole } from "src/prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto";
import { WorkspaceErrors } from "./errors";

@Injectable()
export class WorkspacesService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateWorkspaceDto, user: User) {
    try {
      const { memberships, ...fields } = await this.prismaService.workspace.create({
        data: {
          ...dto,
          memberships: {
            create: {
              role: WorkspaceRole.OWNER,
              user: { connect: { id: user.id } },
            },
          },
        },
        include: {
          memberships: {
            where: { userId: user.id },
          },
        },
      });

      return {
        ...fields,
        membership: memberships[0]!,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException(WorkspaceErrors.SLUG_ALREADY_IN_USE);
      }
      throw error;
    }
  }

  async findAllAccessible(user: User) {
    const workspaces = await this.prismaService.workspace.findMany({
      where: {
        memberships: { some: { userId: user.id } },
      },
      include: {
        memberships: {
          where: { userId: user.id },
        },
      },
      orderBy: { name: "asc" },
    });

    return workspaces.map(({ memberships, ...fields }) => ({
      ...fields,
      membership: memberships[0]!,
    }));
  }

  async findOneAccessible(slug: string, user: User) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: {
        slug,
        memberships: { some: { userId: user.id } },
      },
      include: {
        memberships: {
          where: { userId: user.id },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException(WorkspaceErrors.NOT_FOUND);
    }

    const { memberships, ...fields } = workspace;
    return {
      ...fields,
      membership: memberships[0]!,
    };
  }

  async checkSlugAvailability(slug: string) {
    const workspace = await this.prismaService.workspace.findUnique({ where: { slug } });

    return { available: !workspace };
  }
}
