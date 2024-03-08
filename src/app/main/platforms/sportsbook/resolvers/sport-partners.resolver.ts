import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {ConfigService} from "../../../../core/services/config.service";
import {map} from "rxjs/operators";
import {LocalStorageService} from "../../../../core/services/local-storage.service";
import {CommonDataService} from "../../../../core/services/common-data.service";
import { SportsbookApiService } from '../services/sportsbook-api.service';

@Injectable()
export class SportPartnersResolver 
{
  constructor(private apiService:SportsbookApiService,
              private configService:ConfigService,
              private localStorageService:LocalStorageService,
              private commonDataService:CommonDataService)
  {

  }

  resolve(route: ActivatedRouteSnapshot): Promise<any> | any
  {
    const partners = this.localStorageService.get('sb_partners');
    if(partners)
    {
      this.commonDataService.setPartners(partners);
      return partners;
    }
    else
    {
      return this.apiService.apiPost("partners")
      .pipe(map(data => {
          let partners = [];
          if( data.Code === 0)
          {
            partners = data.ResponseObject;
            this.localStorageService.add('sb_partners', partners);
            this.commonDataService.setPartners(partners);
          }
          return  partners;
      }));
    }
  }
}
