import { UnauthorizedException } from "@nestjs/common";

export class SessionExpiredException extends UnauthorizedException {
  constructor() {
    super({
      code: "auth.session_expired",
      message: "Session is expired",
    });
  }
}
