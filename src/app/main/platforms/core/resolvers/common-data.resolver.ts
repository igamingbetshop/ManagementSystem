import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {ConfigService} from "../../../../core/services/config.service";
import {Controllers, Methods} from "../../../../core/enums";
import {map} from "rxjs/operators";
import {LocalStorageService} from "../../../../core/services/local-storage.service";
import {CommonDataService} from "../../../../core/services/common-data.service";
import {CoreApiService} from "../services/core-api.service";

@Injectable()
export class CommonDataResolver 
{
  constructor(private apiService:CoreApiService,
              private configService:ConfigService,
              private localStorageService:LocalStorageService,
              private commonDataService:CommonDataService)
  {

  }

  resolve(route: ActivatedRouteSnapshot): Promise<any> | any
  {
    const commonData = this.localStorageService.get('common-data');
    if(commonData)
    {
      this.commonDataService.initCommonData(commonData);
      return commonData;
    }
    else
    {
      return this.apiService.apiPost(this.configService.getApiUrl,
        null, true, Controllers.ENUMERATION, Methods.GET_COMMON_DATA).pipe(map(data => {
          let commonData = [];
          if( data.ResponseCode === 0)
          {
            commonData = data.ResponseObject;
            this.localStorageService.add('common-data', commonData);
            this.commonDataService.initCommonData(commonData);
          }
          return  commonData;
      }));
    }
  }
}
