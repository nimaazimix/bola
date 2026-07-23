import { Injectable } from "@nestjs/common";
import { Prisma, PrismaService, User } from "src/prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto";
import { SlugAlreadyInUseException } from "./exceptions";

@Injectable()
export class WorkspacesService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateWorkspaceDto, user: User) {
    try {
      return await this.prismaService.workspace.create({
        data: {
          ...dto,
          memberships: { create: { role: "OWNER", user: { connect: { id: user.id } } } },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new SlugAlreadyInUseException();
      }
      throw error;
    }
  }

  async findAll(user: User) {
    return this.prismaService.workspace.findMany({
      where: { memberships: { some: { userId: user.id } } },
      orderBy: { createdAt: "desc" },
    });
  }
}
