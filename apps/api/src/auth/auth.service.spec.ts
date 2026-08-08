import { Test, TestingModule } from "@nestjs/testing";
import { mock, MockProxy } from "jest-mock-extended";
import {
  ConfigServiceMock,
  createConfigServiceMock,
  createPrismaServiceMock,
  PrismaServiceMock,
} from "test/mocks";
import { accountFactory, sessionFactory, userFactory, verificationFactory } from "test/factories";

import { BadRequestException, ConflictException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService, Provider, VerificationType } from "src/prisma/prisma.service";
import { MailService } from "src/mail/mail.service";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { after, before, generateToken, sha256 } from "src/common/utils";
import argon2 from "argon2";
import { AuthService } from "./auth.service";

jest.mock("src/common/utils", () => ({
  ...jest.requireActual("src/common/utils"),
  generateToken: jest.fn(),
  sha256: jest.fn(),
}));

jest.mock("argon2", () => ({
  hash: jest.fn(() => "hashed-password"),
  verify: jest.fn(),
}));

describe("AuthService", () => {
  let service: AuthService;

  let configServiceMock: ConfigServiceMock;
  let prismaServiceMock: PrismaServiceMock;
  let mailServiceMock: MockProxy<MailService>;
  let jwtServiceMock: MockProxy<JwtService>;

  beforeEach(async () => {
    configServiceMock = createConfigServiceMock({
      CLIENT_URL: "http://localhost:3000",
      ACCESS_TOKEN_SECRET: "secret",
      ACCESS_TOKEN_EXPIRES_IN: "15m",
      SESSION_EXPIRES_IN: "7d",
    });
    prismaServiceMock = createPrismaServiceMock();
    prismaServiceMock.$transaction.mockImplementation(async (cb) => cb(prismaServiceMock));

    mailServiceMock = mock<MailService>();
    jwtServiceMock = mock<JwtService>();

    jest.useFakeTimers().setSystemTime(new Date("2000-01-01T00:00:00Z"));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: configServiceMock },
        { provide: PrismaService, useValue: prismaServiceMock },
        { provide: MailService, useValue: mailServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("signUp", () => {
    it("should create user with credentials and send verification link successfully", async () => {
      // Arrange
      const dto = {
        name: "User",
        email: "USER@example.com",
        password: "password",
      };
      const newUser = userFactory.build({ name: dto.name, email: "user@example.com" });

      prismaServiceMock.user.findUnique.mockResolvedValue(null);
      prismaServiceMock.user.create.mockResolvedValue(newUser);
      jest.mocked(generateToken).mockReturnValue("vrf-token");
      jest.mocked(sha256).mockReturnValue("hashed-vrf-token");

      // Act
      const result = await service.signUp(dto);

      // Assert
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "user@example.com" },
      });
      expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          email: "user@example.com",
          accounts: {
            create: {
              providerId: Provider.credentials,
              accountId: "user@example.com",
              passwordHash: "hashed-password",
            },
          },
          verifications: {
            create: {
              type: VerificationType.email_verification,
              tokenHash: "hashed-vrf-token",
              expiresAt: after("1d"),
            },
          },
        },
      });
      expect(argon2.hash).toHaveBeenCalledWith(dto.password);
      expect(mailServiceMock.sendVerificationEmail).toHaveBeenCalledWith(
        newUser.email,
        "http://localhost:3000/verify-email?token=vrf-token",
      );
      expect(result).toEqual(newUser);
    });

    it("should attach redirect to verification link when it is provided", async () => {
      // Arrange
      const dto = {
        name: "User",
        email: "user@example.com",
        password: "password",
      };
      const newUser = userFactory.build({ name: dto.name, email: dto.email });

      prismaServiceMock.user.findUnique.mockResolvedValue(null);
      prismaServiceMock.user.create.mockResolvedValue(newUser);
      jest.mocked(generateToken).mockReturnValue("vrf-token");

      // Act
      await service.signUp(dto, "/acme");

      // Assert
      expect(mailServiceMock.sendVerificationEmail).toHaveBeenCalledWith(
        newUser.email,
        "http://localhost:3000/verify-email?token=vrf-token&redirect=%2Facme",
      );
    });

    it("should throw ConflictException when email address is already in use", async () => {
      // Arrange
      const dto = {
        name: "User",
        email: "user@example.com",
        password: "password",
      };
      const user = userFactory.build({ email: dto.email });
      prismaServiceMock.user.findUnique.mockResolvedValue(user);

      // Act, Assert
      await expect(service.signUp(dto)).rejects.toThrow(ConflictException);
      expect(prismaServiceMock.user.create).not.toHaveBeenCalled();
      expect(mailServiceMock.sendVerificationEmail).not.toHaveBeenCalled();
    });
  });

  describe("verify", () => {
    it("should verify user and authenticate them successfully", async () => {
      // Arrange
      const dto = { token: "vrf-token" };
      const user = userFactory.build({ emailVerified: true });
      const verification = verificationFactory.build({ userId: user.id });

      prismaServiceMock.verification.findUnique.mockResolvedValue(verification);
      prismaServiceMock.user.update.mockResolvedValue(user);
      jwtServiceMock.signAsync.mockResolvedValue("access-token");
      jest.mocked(generateToken).mockReturnValue("refresh-token");
      jest
        .mocked(sha256)
        .mockReturnValueOnce("hashed-vrf-token")
        .mockReturnValue("hashed-refresh-token");

      // Act
      const result = await service.verify(dto, "agent");

      // Assert
      expect(prismaServiceMock.verification.findUnique).toHaveBeenCalledWith({
        where: { tokenHash: "hashed-vrf-token" },
      });
      expect(prismaServiceMock.verification.delete).toHaveBeenCalledWith({
        where: { id: verification.id },
      });
      expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
        where: { id: verification.userId },
        data: { emailVerified: true },
      });
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({ sub: user.id });
      expect(prismaServiceMock.session.create).toHaveBeenCalledWith({
        data: {
          userAgent: "agent",
          refreshTokenHash: "hashed-refresh-token",
          expiresAt: after("7d"),
          user: { connect: { id: user.id } },
        },
      });
      expect(result).toEqual({
        user,
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
    });

    it("should throw BadRequestException when verification is expired", async () => {
      // Arrange
      const dto = { token: "vrf-token" };
      const verification = verificationFactory.build({ expiresAt: before("1h") });
      prismaServiceMock.verification.findUnique.mockResolvedValue(verification);

      // Act, Assert
      await expect(service.verify(dto, "agent")).rejects.toThrow(BadRequestException);
      expect(prismaServiceMock.verification.delete).not.toHaveBeenCalled();
      expect(prismaServiceMock.user.update).not.toHaveBeenCalled();
      expect(prismaServiceMock.session.create).not.toHaveBeenCalled();
    });

    it("should throw BadRequestException when verification is not found", async () => {
      // Arrange
      const dto = { token: "vrf-token" };
      prismaServiceMock.verification.findUnique.mockResolvedValue(null);

      // Act, Assert
      await expect(service.verify(dto, "agent")).rejects.toThrow(BadRequestException);
      expect(prismaServiceMock.verification.delete).not.toHaveBeenCalled();
      expect(prismaServiceMock.user.update).not.toHaveBeenCalled();
      expect(prismaServiceMock.session.create).not.toHaveBeenCalled();
    });
  });

  describe("signIn", () => {
    it("should authenticate user successfully", async () => {
      // Arrange
      const dto = {
        email: "USER@example.com",
        password: "password",
      };
      const user = userFactory.build({ email: "user@example.com", emailVerified: true });
      const account = accountFactory.build({ userId: user.id, accountId: user.email });

      prismaServiceMock.user.findUnique.mockResolvedValue(user);
      prismaServiceMock.account.findUnique.mockResolvedValue(account);
      jest.mocked(argon2.verify).mockResolvedValue(true);

      jwtServiceMock.signAsync.mockResolvedValue("access-token");
      jest.mocked(generateToken).mockReturnValue("refresh-token");
      jest.mocked(sha256).mockReturnValue("hashed-refresh-token");

      // Act
      const result = await service.signIn(dto, "agent");

      // Assert
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: "user@example.com" },
      });
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({ sub: user.id });
      expect(prismaServiceMock.session.create).toHaveBeenCalledWith({
        data: {
          userAgent: "agent",
          refreshTokenHash: "hashed-refresh-token",
          expiresAt: after("7d"),
          user: { connect: { id: user.id } },
        },
      });
      expect(result).toEqual({
        user,
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
    });

    it("should throw UnauthorizedException when password is incorrect", async () => {
      // Arrange
      const dto = {
        email: "user@example.com",
        password: "password",
      };
      const user = userFactory.build({ email: dto.email, emailVerified: true });
      const account = accountFactory.build({ userId: user.id, accountId: user.email });

      prismaServiceMock.user.findUnique.mockResolvedValue(user);
      prismaServiceMock.account.findUnique.mockResolvedValue(account);
      jest.mocked(argon2.verify).mockResolvedValue(false);

      // Act, Assert
      await expect(service.signIn(dto, "agent")).rejects.toThrow(UnauthorizedException);
      expect(prismaServiceMock.session.create).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException when credentials account is not found", async () => {
      // Arrange
      const dto = {
        email: "user@example.com",
        password: "password",
      };
      const user = userFactory.build({ email: dto.email, emailVerified: true });

      prismaServiceMock.user.findUnique.mockResolvedValue(user);
      prismaServiceMock.account.findUnique.mockResolvedValue(null);

      // Act, Assert
      await expect(service.signIn(dto, "agent")).rejects.toThrow(UnauthorizedException);
      expect(prismaServiceMock.session.create).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException when email address is not verified", async () => {
      // Arrange
      const dto = {
        email: "user@example.com",
        password: "password",
      };
      const user = userFactory.build({ email: dto.email });

      prismaServiceMock.user.findUnique.mockResolvedValue(user);

      // Act, Assert
      await expect(service.signIn(dto, "agent")).rejects.toThrow(UnauthorizedException);
      expect(prismaServiceMock.session.create).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException when user is not found", async () => {
      // Arrange
      const dto = {
        email: "user@example.com",
        password: "password",
      };
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      // Act, Assert
      await expect(service.signIn(dto, "agent")).rejects.toThrow(UnauthorizedException);
      expect(prismaServiceMock.session.create).not.toHaveBeenCalled();
    });
  });

  describe("refresh", () => {
    it("should rotate session successfully", async () => {
      // Arrange
      const user = userFactory.build({ emailVerified: true });
      const session = { ...sessionFactory.build({ userId: user.id }), user };

      prismaServiceMock.session.findUnique.mockResolvedValue(session);
      jwtServiceMock.signAsync.mockResolvedValue("access-token");
      jest.mocked(generateToken).mockReturnValue("new-refresh-token");
      jest.mocked(sha256).mockReturnValue("hashed-refresh-token");

      // Act
      const result = await service.refresh("refresh-token");

      // Assert
      expect(prismaServiceMock.session.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { refreshTokenHash: "hashed-refresh-token" },
        }),
      );
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({ sub: user.id });
      expect(prismaServiceMock.session.update).toHaveBeenCalledWith({
        where: { id: session.id },
        data: { refreshTokenHash: "hashed-refresh-token" },
      });
      expect(result).toEqual({
        user,
        accessToken: "access-token",
        refreshToken: "new-refresh-token",
      });
    });

    it("should throw UnauthorizedException when session is expired", async () => {
      // Arrange
      const session = sessionFactory.build({ expiresAt: before("1h") });
      prismaServiceMock.session.findUnique.mockResolvedValue(session);

      // Act, Assert
      await expect(service.refresh("refresh-token")).rejects.toThrow(UnauthorizedException);
      expect(prismaServiceMock.session.update).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException when session is not found", async () => {
      // Arrange
      prismaServiceMock.session.findUnique.mockResolvedValue(null);

      // Act, Assert
      await expect(service.refresh("refresh-token")).rejects.toThrow(UnauthorizedException);
      expect(prismaServiceMock.session.update).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException when refresh token does not exist", async () => {
      // Act, Assert
      await expect(service.refresh(undefined)).rejects.toThrow(UnauthorizedException);
      expect(prismaServiceMock.session.update).not.toHaveBeenCalled();
    });
  });

  describe("signOut", () => {
    it("should delete session successfully", async () => {
      // Arrange
      jest.mocked(sha256).mockReturnValue("hashed-refresh-token");

      // Act
      await service.signOut("refresh-token");

      // Assert
      expect(prismaServiceMock.session.deleteMany).toHaveBeenCalledWith({
        where: { refreshTokenHash: "hashed-refresh-token" },
      });
    });

    it("should do nothing when refresh token does not exist", async () => {
      // Act
      await service.signOut(undefined);

      // Assert
      expect(prismaServiceMock.session.deleteMany).not.toHaveBeenCalled();
    });
  });

  describe("authenticate", () => {
    it("should return authenticated user successfully", async () => {
      // Arrange
      const user = userFactory.build({ emailVerified: true });
      jwtServiceMock.verifyAsync.mockResolvedValue({ sub: user.id });
      prismaServiceMock.user.findUnique.mockResolvedValue(user);

      // Act
      const result = await service.authenticate("access-token");

      // Assert
      expect(result).toEqual(user);
    });

    it("should throw UnauthorizedException when user is not found", async () => {
      // Arrange
      jwtServiceMock.verifyAsync.mockResolvedValue({ sub: "usr_id" });
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      // Act, Assert
      await expect(service.authenticate("access-token")).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException when access token is expired", async () => {
      // Arrange
      jwtServiceMock.verifyAsync.mockRejectedValue(new TokenExpiredError("Expired", new Date()));

      // Act, Assert
      await expect(service.authenticate("access-token")).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException when access token is invalid", async () => {
      // Arrange
      jwtServiceMock.verifyAsync.mockRejectedValue(new JsonWebTokenError("Invalid"));

      // Act, Assert
      await expect(service.authenticate("access-token")).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException when access token does not exist", async () => {
      // Act, Assert
      await expect(service.authenticate(undefined)).rejects.toThrow(UnauthorizedException);
    });
  });
});
