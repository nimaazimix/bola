import { UnauthorizedException } from "@nestjs/common";

export class SessionInvalidException extends UnauthorizedException {
  constructor() {
    super({
      code: "auth.session_invalid",
      message: "Session is missing or invalid",
    });
  }
}
