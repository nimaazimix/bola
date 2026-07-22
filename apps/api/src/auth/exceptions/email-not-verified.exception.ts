import { UnauthorizedException } from "@nestjs/common";

export class EmailNotVerifiedException extends UnauthorizedException {
  constructor() {
    super({
      code: "auth.email_not_verified",
      message: "Email address has not been verified",
    });
  }
}
