import {Injectable} from '@angular/core';
import { Route, Router, UrlSegment } from '@angular/router';
import {AuthService} from '../services/auth.service';
import {LocalStorageService} from '../services/local-storage.service';
import {ApiService} from "../services/api.service";
import {ConfigService} from "../services/config.service";
import {Methods} from "../enums";

@Injectable({providedIn: 'root'})
export class AuthGuard  {

  isTokenValidated = false;
  constructor(private router: Router,
              private localStorageService: LocalStorageService,
              private config:ConfigService,
              private authService: AuthService,
              private apiService:ApiService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Promise<boolean> {

    if(this.authService.isAuthenticated)
    {
      if(this.isTokenValidated)
        return true;

      /*if(this.authService.getUser.IsTwoFactorEnabled)
        return true;*/

      return new Promise((resolve) => {

        this.apiService.apiGet(this.config.getApiUrl, null, Methods.VALIDATE_TOKEN).toPromise()
          .then((responseData) => {
            if (responseData['ResponseCode'] === 0)
            {
              this.isTokenValidated = true;
              resolve(true);
            }
            else
            {
              this.localStorageService.removeAll();
              this.router.navigate(['/login']);
              resolve(false);
            }
          })
          .catch(err => {
            this.localStorageService.removeAll();
            this.router.navigate(['/login']);
            resolve(false);
          });
      });
    }
    else
    {
      this.router.navigate(['login']);
      return false;
    }
  }
}
