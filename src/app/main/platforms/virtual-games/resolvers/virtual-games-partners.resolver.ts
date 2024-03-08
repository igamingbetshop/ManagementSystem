import {Injectable} from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import {CommonDataService, ConfigService, LocalStorageService} from "../../../../core/services";
import {VirtualGamesApiService} from "../services/virtual-games-api.service";
import {map} from "rxjs/operators";


@Injectable()
export class VirtualGamesPartnersResolver  {
  constructor(private apiService: VirtualGamesApiService,
              private configService: ConfigService,
              private localStorageService: LocalStorageService,
              private commonDataService: CommonDataService) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<any> | any {
    const partners = this.localStorageService.get('vg_partners');
    if (partners) {
      this.commonDataService.setPartners(partners);
      return partners;
    } else {
      return this.apiService.apiPost("partners")
        .pipe(map(data => {
          let partners = [];
          if (data.ResponseCode === 0) {
            partners = data.ResponseObject.Entities;
            this.localStorageService.add('vg_partners', partners);
            this.commonDataService.setPartners(partners);
          }
          return partners;
        }));
    }
  }
}
