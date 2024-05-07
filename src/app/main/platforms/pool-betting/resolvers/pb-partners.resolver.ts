import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { map } from "rxjs/operators";
import { LocalStorageService } from "../../../../core/services/local-storage.service";
import { CommonDataService } from "../../../../core/services/common-data.service";
import { PoolBettingApiService } from '../../sportsbook/services/pool-betting-api.service';
import { PBControllers } from 'src/app/core/enums';

@Injectable()
export class PBPartnersResolver {
  constructor(
    private apiService: PoolBettingApiService,
    private localStorageService: LocalStorageService,
    private commonDataService: CommonDataService) {

  }

  resolve(route: ActivatedRouteSnapshot): Promise<any> | any {
    const partners = this.localStorageService.get('pb_partners');
    if (partners) {
      this.commonDataService.setPartners(partners);
      return partners;
    }
    else {
      return this.apiService.apiPost(PBControllers.PARTNERS,)
        .pipe(map(data => {
          let partners = [];
          if (data.Code === 0) {
            partners = data.ResponseObject;
            this.localStorageService.add('pb_partners', partners);
            this.commonDataService.setPartners(partners);
          }
          return partners;
        }));
    }
  }
}
