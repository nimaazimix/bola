import { BadRequestException } from "@nestjs/common";

export class VerificationExpiredException extends BadRequestException {
  constructor() {
    super({
      code: "auth.verification_expired",
      message: "Verification is expired",
    });
  }
}
