import { UnauthorizedException } from "@nestjs/common";

export class UserNotFoundException extends UnauthorizedException {
  constructor() {
    super({
      code: "auth.user_not_found",
      message: "Authenticated user no longer exists",
    });
  }
}
