import { ConflictException } from "@nestjs/common";

export class SlugAlreadyInUseException extends ConflictException {
  constructor() {
    super({
      code: "workspace.slug_already_in_use",
      message: "Slug is already in use",
    });
  }
}
