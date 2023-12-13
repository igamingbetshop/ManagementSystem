import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getTimeZone } from '../utils';
import { AuthService, LoaderService } from "../services";

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(
    private loaderService: LoaderService,
    private auth: AuthService,
    private router: Router,
  ) {}

  removeRequest(req: HttpRequest<any>) {
    this.requests = this.requests.filter(request => request !== req);
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeZone = getTimeZone();
    const lang = localStorage.getItem('lang') || 'en'; 

    const token = JSON.parse(localStorage.getItem('token'));
    const urlToken = token ? `&token=${token}` : '';

    let clonedRequest: HttpRequest<any> = req.clone({
      url: `${req.url}?TimeZone=${timeZone}&LanguageId=${lang}${urlToken}`,
    });

    if (req.method === 'POST') {
      clonedRequest = clonedRequest.clone({
        body: { ...clonedRequest.body, Token: token },
      });
    }

    this.requests.push(clonedRequest);
    this.loaderService.isLoading.next(true);

    return new Observable(observer => {
      const subscription = next.handle(clonedRequest).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            if (event.body.ResponseCode === 28 || event.body.ResponseCode === 29) {
              if (this.auth.isAuthenticated) {
                this.auth.logOut(true);
                this.router.navigate(['/login']);
              }
            }
            this.removeRequest(clonedRequest);
            observer.next(event);
          }
        },
        err => {
          this.removeRequest(clonedRequest);
          observer.error(err);
        },
        () => {
          this.removeRequest(clonedRequest);
          observer.complete();
        }
      );

      return () => {
        this.removeRequest(clonedRequest);
        subscription.unsubscribe();
      };
    });
  }
}
