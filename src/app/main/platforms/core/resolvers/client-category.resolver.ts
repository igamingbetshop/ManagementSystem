import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {ConfigService} from "../../../../core/services/config.service";
import {Controllers, Methods} from "../../../../core/enums";
import {map} from "rxjs/operators";
import {LocalStorageService} from "../../../../core/services/local-storage.service";
import {CoreApiService} from "../services/core-api.service";

@Injectable()
export class ClientCategoryResolver 
{
  constructor(private apiService:CoreApiService,
              private configService:ConfigService,
              private localStorageService:LocalStorageService)
  {

  }

  resolve(route: ActivatedRouteSnapshot): Promise<any> | any
  {
    const clientCategories = this.localStorageService.get('client-categories');
    if(clientCategories)
    {
      return clientCategories;
    }
    else
    {
      return this.apiService.apiPost(this.configService.getApiUrl,
        {}, true, Controllers.ENUMERATION, Methods.GET_CLIENT_CATEGORIES_ENUM).pipe(map(data => {
          let clientCategories = [];
          if( data.ResponseCode === 0)
          {
            clientCategories = data.ResponseObject;
            this.localStorageService.add('client-categories', clientCategories);
          }
          return  clientCategories;
      }));
    }
  }
}
