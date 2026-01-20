import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environment/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = environment.apiKey;
  const modifiedReq = req.clone({
    setHeaders: {
      'x-api-key': apiKey,
    },
  });
  return next(modifiedReq);
};
