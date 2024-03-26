import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {ConfigService} from "../../../../core/services/config.service";
import {Controllers, Methods} from "../../../../core/enums";
import {map} from "rxjs/operators";
import {LocalStorageService} from "../../../../core/services/local-storage.service";
import {CommonDataService} from "../../../../core/services/common-data.service";
import {CoreApiService} from "../services/core-api.service";

@Injectable()
export class PartnersResolver
{
  constructor(private apiService:CoreApiService,
              private configService:ConfigService,
              private localStorageService:LocalStorageService,
              private commonDataService:CommonDataService)
  {

  }

  resolve(route: ActivatedRouteSnapshot): Promise<any> | any
  {
    const partners = this.localStorageService.get('core_partners');
    if(partners)
    {
      this.commonDataService.setPartners(partners);
      return partners;
    }
    else
    {
      return this.apiService.apiPost(this.configService.getApiUrl,
        {TakeCount:500}, true, Controllers.PARTNER, Methods.GET_PARTNERS).pipe(map(data => {
          let partners = [];
          if( data.ResponseCode === 0) {
            partners = data.ResponseObject.Entities;
            this.localStorageService.add('core_partners', partners);
            this.commonDataService.setPartners(partners);
          }
          return  partners;
      }));
    }
  }
}
