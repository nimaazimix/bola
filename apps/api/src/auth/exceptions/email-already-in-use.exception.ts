import { ConflictException } from "@nestjs/common";

export class EmailAlreadyInUseException extends ConflictException {
  constructor() {
    super({
      code: "auth.email_already_in_use",
      message: "Email address is already in use",
    });
  }
}
