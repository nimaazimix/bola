import { UnauthorizedException } from "@nestjs/common";

export class AccessTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      code: "auth.access_token_expired",
      message: "Access token is expired",
    });
  }
}
