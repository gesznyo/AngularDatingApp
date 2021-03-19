import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse) {
          switch (errorResponse.status) {
            case 400:
              if (errorResponse.error.errors) {
                const modelStateErrors = [];
                for (const key in errorResponse.error.errors) {
                  if (
                    Object.prototype.hasOwnProperty.call(
                      errorResponse.error.errors,
                      key
                    )
                  ) {
                    const element = errorResponse.error.errors[key];
                    modelStateErrors.push(element);
                  }
                }
                throw modelStateErrors.flat();
              } else if (typeof errorResponse.error === 'object') {
                this.toastr.error(
                  errorResponse.statusText,
                  errorResponse.status.toString()
                );
              } else {
                this.toastr.error(
                  errorResponse.error,
                  errorResponse.status.toString()
                );
              }
              break;

            case 401:
              this.toastr.error(
                'Unauthorized',
                errorResponse.status.toString()
              );
              break;

            case 404:
              this.router.navigateByUrl('/not-found');
              break;

            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: errorResponse.error },
              };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;

            default:
              this.toastr.error('Something unexpected went wrong.');
              console.log(errorResponse);
              break;
          }
        }

        return throwError(errorResponse);
      })
    );
  }
}
