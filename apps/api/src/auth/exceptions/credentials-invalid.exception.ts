import { UnauthorizedException } from "@nestjs/common";

export class CredentialsInvalidException extends UnauthorizedException {
  constructor() {
    super({
      code: "auth.credentials_invalid",
      message: "Email address or password is incorrect",
    });
  }
}
