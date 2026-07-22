import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { ZodSerializerDto } from "nestjs-zod";
import { CurrentUser, Public } from "src/common/decorators";
import {
  AuthResponseDto,
  SigninDto,
  SignupDto,
  SignupQueryDto,
  UserResponseDto,
  VerifyEmailDto,
} from "./dto";
import { after } from "src/common/utils";
import type { Request, Response } from "express";
import type { User } from "@bola/db";

@Controller("auth")
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post("signup")
  @ZodSerializerDto(UserResponseDto)
  async signup(@Body() dto: SignupDto, @Query() query: SignupQueryDto) {
    return this.authService.signup(dto, query.redirect);
  }

  @Public()
  @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(AuthResponseDto)
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...rest } = await this.authService.verify(dto, req.headers["user-agent"]);

    this.storeRefreshToken(res, refreshToken);
    return rest;
  }

  @Public()
  @Post("signin")
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(AuthResponseDto)
  async signin(
    @Body() dto: SigninDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...rest } = await this.authService.signin(dto, req.headers["user-agent"]);

    this.storeRefreshToken(res, refreshToken);
    return rest;
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(AuthResponseDto)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...rest } = await this.authService.refresh(req.cookies["refresh_token"]);

    this.storeRefreshToken(res, refreshToken);
    return rest;
  }

  @Public()
  @Post("signout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async signout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.signout(req.cookies["refresh_token"]);

    res.clearCookie("refresh_token");
  }

  @Get("me")
  @ZodSerializerDto(UserResponseDto)
  async getMe(@CurrentUser() user: User) {
    return user;
  }

  private async storeRefreshToken(res: Response, refreshToken: string) {
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: this.configService.get("NODE_ENV", "development") === "production",
      expires: after(this.configService.getOrThrow("SESSION_EXPIRES_IN")),
    });
  }
}
