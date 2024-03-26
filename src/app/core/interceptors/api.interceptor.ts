import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { getTimeZone } from '../utils';
import { AuthService, LoaderService } from "../services";

@Injectable({
  providedIn: 'root'
})
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
    if (req.body && req.body?.RequestObject && req.body.RequestObject.Loading !== false) {
      this.loaderService.isLoading.next(true);
      delete req.body.RequestObject.Loading;
      delete req.body.Loading;
    } 
  
    let clonedRequest: HttpRequest<any> = req.clone({
      url: `${req.url}?TimeZone=${timeZone}&LanguageId=${lang}${urlToken}`,
    });
  
    if (req.method === 'POST') {
      clonedRequest = clonedRequest.clone({
        body: { ...clonedRequest.body, Token: token },
      });
    }
  
    if (clonedRequest.body && req.url && req.body?.Loading !== false) {
      this.loaderService.isLoading.next(true);
      this.requests.push(clonedRequest);
    } 
  
    return next.handle(clonedRequest).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          if (event.body.ResponseCode === 28 || event.body.ResponseCode === 29) {
            if (this.auth.isAuthenticated) {
              this.auth.logOut(true);
              this.router.navigate(['/login']);
            }
          }
        }
      }),
      catchError(err => {
        return throwError(err);
      }),
      finalize(() => {
        if(clonedRequest.body && clonedRequest.body.RequestObject && clonedRequest.body.RequestObject.Loading == false) {
          this.loaderService.isLoading.next(false);
          this.requests = [];
        } else {
          this.removeRequest(clonedRequest);
        }
      })
    );
  }
  
}
