import {Injectable} from '@angular/core';
import {ApiService, AuthService, ConfigService} from "../../../../core/services";
import {UserModel} from "../../../../core/models/user-model";
import {getTimeZone} from "../../../../core/utils";

@Injectable()
export class PoolBettingApiService {

  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
    private authService: AuthService
  ) {
  }

  apiPost(Controller: string = '', Method : string = '', data = null) {
    let user: UserModel = this.authService.getUser;
    let body = {
      CurrencyId: user.CurrencyId,
      LanguageId: user.LanguageId,
      TimeZone: getTimeZone(),
      UserId: user.UserId
    };
    const requestUrl = `${this.configService.getPBApiUrl}/api/${Controller}/${Method}`;
    if (data) {
      body = {...body, ...data}
    }
    return this.apiService.apiPost(requestUrl, body);
  }

}
