import { BadRequestException } from "@nestjs/common";

export class VerificationInvalidException extends BadRequestException {
  constructor() {
    super({
      code: "auth.verification_invalid",
      message: "Verification is invalid",
    });
  }
}
