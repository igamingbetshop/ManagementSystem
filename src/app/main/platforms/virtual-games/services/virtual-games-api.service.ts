import {Injectable} from "@angular/core";
import {ApiService, AuthService, ConfigService} from "../../../../core/services";
import {UserModel} from "../../../../core/models/user-model";
import {getTimeZone} from "../../../../core/utils";


@Injectable()
export class VirtualGamesApiService {
  constructor(private apiService:ApiService,
              private configService:ConfigService,
              private authService:AuthService)
  {

  }

  apiPost(path:string = '', data = null)
  {
    let requestUrl = '';
    let user:UserModel = this.authService.getUser;
    let body = {
      CurrencyId:user.CurrencyId,
      LanguageId: user.LanguageId,
      TimeZone: getTimeZone(),
      UserId: user.UserId
    };
    requestUrl = `${this.configService.getVGApiUrl}/` + path;
    if(data)
      body = {...body, ...data}
    return this.apiService.apiPost(requestUrl, body);
  }
}
