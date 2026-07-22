import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendVerificationEmail(to: string, url: string) {
    // TODO: send actual verification email
    this.logger.log(`Please verify your account: ${url}`);
  }
}
