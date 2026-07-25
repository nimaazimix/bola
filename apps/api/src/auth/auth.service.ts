import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService, Provider, VerificationType } from "src/prisma/prisma.service";
import { MailService } from "src/mail/mail.service";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { SigninDto, SignupDto, VerifyEmailDto } from "./dto";
import {
  AccessTokenExpiredException,
  AccessTokenInvalidException,
  CredentialsInvalidException,
  EmailAlreadyInUseException,
  EmailNotVerifiedException,
  SessionExpiredException,
  SessionInvalidException,
  UserNotFoundException,
  VerificationExpiredException,
  VerificationInvalidException,
} from "./exceptions";
import { after, generateToken, sha256 } from "src/common/utils";
import argon2 from "argon2";

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto, redirect?: string) {
    const normalizedEmail = dto.email.toLowerCase();

    const existingUser = await this.prismaService.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new EmailAlreadyInUseException();
    }

    const hashedPassword = await argon2.hash(dto.password);
    const vrfToken = generateToken(32);

    const user = await this.prismaService.user.create({
      data: {
        name: dto.name,
        email: normalizedEmail,
        accounts: {
          create: {
            providerId: Provider.credentials,
            accountId: normalizedEmail,
            passwordHash: hashedPassword,
          },
        },
        verifications: {
          create: {
            type: VerificationType.email_verification,
            tokenHash: sha256(vrfToken),
            expiresAt: after("1d"),
          },
        },
      },
    });

    const url = new URL(`${this.configService.getOrThrow("CLIENT_URL")}/verify-email`);
    url.searchParams.set("token", vrfToken);
    if (redirect) {
      url.searchParams.set("redirect", redirect);
    }

    await this.mailService.sendVerificationEmail(user.email, url.toString());
    return user;
  }

  async verify(dto: VerifyEmailDto, userAgent: string | undefined) {
    const verification = await this.prismaService.verification.findUnique({
      where: { tokenHash: sha256(dto.token) },
    });

    if (!verification) {
      throw new VerificationInvalidException();
    }

    if (verification.expiresAt < new Date()) {
      throw new VerificationExpiredException();
    }

    const user = await this.prismaService.$transaction(async (tx) => {
      await tx.verification.delete({ where: { id: verification.id } });
      return tx.user.update({
        where: { id: verification.userId },
        data: { emailVerified: true },
      });
    });

    const accessToken = await this.jwtService.signAsync({ sub: user.id });
    const refreshToken = generateToken(32);

    await this.prismaService.session.create({
      data: {
        userAgent,
        refreshTokenHash: sha256(refreshToken),
        expiresAt: after(this.configService.getOrThrow("SESSION_EXPIRES_IN")),
        user: { connect: { id: user.id } },
      },
    });

    return { user, accessToken, refreshToken };
  }

  async signin(dto: SigninDto, userAgent: string | undefined) {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new CredentialsInvalidException();
    }

    if (!user.emailVerified) {
      throw new EmailNotVerifiedException();
    }

    const account = await this.prismaService.account.findUnique({
      where: {
        providerId_accountId: { providerId: Provider.credentials, accountId: user.email },
      },
    });

    if (!account || !(await argon2.verify(account.passwordHash!, dto.password))) {
      throw new CredentialsInvalidException();
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id });
    const refreshToken = generateToken(32);

    await this.prismaService.session.create({
      data: {
        userAgent,
        refreshTokenHash: sha256(refreshToken),
        expiresAt: after(this.configService.getOrThrow("SESSION_EXPIRES_IN")),
        user: { connect: { id: user.id } },
      },
    });

    return { user, accessToken, refreshToken };
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new SessionInvalidException();
    }

    const session = await this.prismaService.session.findUnique({
      where: { refreshTokenHash: sha256(refreshToken) },
      include: { user: true },
    });

    if (!session) {
      throw new SessionInvalidException();
    }

    if (session.expiresAt < new Date()) {
      throw new SessionExpiredException();
    }

    const accessToken = await this.jwtService.signAsync({ sub: session.userId });
    const newRefreshToken = generateToken(32);

    await this.prismaService.session.update({
      where: { id: session.id },
      data: { refreshTokenHash: sha256(newRefreshToken) },
    });

    return { user: session.user, accessToken, refreshToken: newRefreshToken };
  }

  async signout(refreshToken: string | undefined) {
    if (!refreshToken) return;

    await this.prismaService.session.deleteMany({
      where: { refreshTokenHash: sha256(refreshToken) },
    });
  }

  async authenticate(accessToken: string | undefined) {
    if (!accessToken) {
      throw new AccessTokenInvalidException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(accessToken);

      const user = await this.prismaService.user.findUnique({ where: { id: payload.sub } });
      if (!user) {
        throw new UserNotFoundException();
      }

      return user;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new AccessTokenExpiredException();
      }

      if (error instanceof JsonWebTokenError) {
        throw new AccessTokenInvalidException();
      }

      throw error;
    }
  }
}
