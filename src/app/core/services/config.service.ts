import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigService {
  private _defaultOptions: any;
  private _langList: any;
  public baseUrl: string;
  public webApiUrl: string;

  constructor(private http: HttpClient) {
    const arr = window.location.href.split('/');
    this.baseUrl = arr[0] + '//' + arr[2];
  }

  load()
  {
    return new Promise<any>((resolveConfig) => {
      this.http.get(`${this.baseUrl}/assets/config/config.json`).subscribe(config => {
        this._defaultOptions = config;
        this.webApiUrl = config['WebApiUrl'];
        return new Promise<any>((resolveLang) => {
          this.http.post(`${this.webApiUrl}/api/Main/GetAvailableLanguages`, {}).subscribe(lang => {
            this._langList = lang;
            resolveLang(lang);
            resolveConfig(config);
          });
        });
      });
    });
  }

  get defaultOptions(): any {
    return this._defaultOptions;
  }

  get getApiUrl(): string {
    return this._defaultOptions.WebApiUrl + '/api/Main'
  }

  get getSBApiUrl(): string {
    return this._defaultOptions.SBApiUrl
  }

  get getPBApiUrl(): string {
    return this._defaultOptions.PBApiUrl
  }

  get getVGApiUrl(): string {
    return this._defaultOptions.VGApiUrl
  }

  get getSGApiUrl(): string {
    return this._defaultOptions.SGApiUrl
  }

  get homePageUrl(): string {
    return this._defaultOptions.HomePageUrl;
  }

  get langList(): any {
    return this._langList;
  }

  get timeZone() {
    const d = new Date();
    return -1 * d.getTimezoneOffset() / 60;
  }

  get isSignalRCore() {
    return this._defaultOptions.IsCoreSignalR;
  }
}
