import { UnauthorizedException } from "@nestjs/common";

export class AccessTokenInvalidException extends UnauthorizedException {
  constructor() {
    super({
      code: "auth.access_token_invalid",
      message: "Access token is missing or invalid",
    });
  }
}
