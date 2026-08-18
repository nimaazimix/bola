import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { ApiMeta, ApiSuccess } from "@bola/contracts/api";
import { map, Observable } from "rxjs";

export class TransformInterceptor<T> implements NestInterceptor<T, ApiSuccess<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiSuccess<T>> {
    return next.handle().pipe(
      map((result) => {
        if (result instanceof ApiResult) {
          return { success: true, data: result.data, meta: result.meta };
        }
        return { success: true, data: result };
      }),
    );
  }
}

export class ApiResult<T> {
  constructor(
    public data: T,
    public meta?: ApiMeta,
  ) {}
}
