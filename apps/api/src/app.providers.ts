import { Provider } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ZodSerializerInterceptor } from "nestjs-zod";
import { AuthGuard } from "./auth/guards/auth.guard";
import { ValidationPipe } from "./common/pipes";
import { TransformInterceptor } from "./common/interceptors";
import { GlobalExceptionFilter } from "./common/filters";

export const AppProviders: Provider[] = [
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
  {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ZodSerializerInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: TransformInterceptor,
  },
  {
    provide: APP_FILTER,
    useClass: GlobalExceptionFilter,
  },
];
