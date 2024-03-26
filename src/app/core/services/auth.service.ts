import { Injectable } from '@angular/core';
import { Controllers, Methods } from '../enums';
import { ConfigService } from './config.service';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { encryptData } from '../utils';
import { ApiService } from "./api.service";
import { User } from "../models";
import { Subject } from "rxjs";
import { take } from "rxjs/operators";
import { UserModel } from "../models/user-model";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class AuthService {

  public notifyGetUserLoginError: Subject<any> = new Subject<any>();
  public notifyGetUserLoginSucces: Subject<any> = new Subject<any>();

  constructor(
    private apiService: ApiService,
    public configService: ConfigService,
    public router: Router,
    public localStorageService: LocalStorageService,
    private translate: TranslateService,) {
  }

  get isAuthenticated() {
    const token = this.localStorageService.get('token');
    return !!token;
  }

  get token() {
    return this.localStorageService.get('token');
  }

  get getUser(): UserModel {
    return this.localStorageService.get('user');
  }

  logIn(user: User) {
    const url = this.configService.getApiUrl + '/' + Methods.LOGIN;
    this.apiService.apiPost(url, { Data: encryptData(user) }).pipe(take(1)).subscribe(resp => {
      if (resp.ResponseCode === 0) {
        const url  = this.configService.homePageUrl;
        localStorage.setItem('adminMenu', JSON.stringify(resp.AdminMenu));
        this.notifyGetUserLoginSucces.next(resp);
        if(!resp.IsTwoFactorEnabled)
          this.router.navigate([url]);
      } else {
        this.notifyGetUserLoginError.next(resp.Description);
      }
    });
  }

  logOut(forceLogout: boolean = false) {
    if (forceLogout) {
      this.localStorageService.removeAll();
      this.router.navigate(['/login']);
    }
    else {
      const url = this.configService.getApiUrl + '/ApiRequest';
      const data = { Method: Methods.LOGOUT, Controller: Controllers.USER };
      this.apiService.apiPost(url, data).pipe(take(1)).subscribe(resp => {
        if (resp.ResponseCode === 0) {
          this.localStorageService.removeAll();
          this.translate.use('en');
          this.router.navigate(['/login']);
        }
        else {
          console.log(resp.Description);
        }
      });
    }
  }
}
