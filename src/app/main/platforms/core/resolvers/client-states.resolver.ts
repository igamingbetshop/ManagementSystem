import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {ConfigService} from "../../../../core/services/config.service";
import {Controllers, Methods} from "../../../../core/enums";
import {map} from "rxjs/operators";
import {LocalStorageService} from "../../../../core/services/local-storage.service";
import {CoreApiService} from "../services/core-api.service";

@Injectable()
export class ClientStatesResolver 
{
  constructor(private apiService:CoreApiService,
              private configService:ConfigService,
              private localStorageService:LocalStorageService)
  {

  }

  resolve(route: ActivatedRouteSnapshot): Promise<any> | any
  {
    const clientStates = this.localStorageService.get('client-states');
    if(clientStates)
    {
      return clientStates;
    }
    else
    {
      return this.apiService.apiPost(this.configService.getApiUrl,
        {}, true, Controllers.ENUMERATION, Methods.GET_CLIENT_STATES).pipe(map(data => {
          let clientStates = [];
          if( data.ResponseCode === 0)
          {
            clientStates = data.ResponseObject;
            this.localStorageService.add('client-states', clientStates);
          }
          return  clientStates;
      }));
    }
  }
}
