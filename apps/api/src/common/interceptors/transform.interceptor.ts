import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { ApiSuccess } from "@bola/contracts/api";
import { map, Observable } from "rxjs";

export class TransformInterceptor<T> implements NestInterceptor<T, ApiSuccess<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiSuccess<T>> {
    return next.handle().pipe(map((data) => ({ success: true, data })));
  }
}
