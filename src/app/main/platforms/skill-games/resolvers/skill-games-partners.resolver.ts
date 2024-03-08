import {Injectable} from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import {CommonDataService, ConfigService, LocalStorageService} from "../../../../core/services";
import {map} from "rxjs/operators";
import {SkillGamesApiService} from "../services/skill-games-api.service";


@Injectable()
export class SkillGamesPartnersResolver  {
  constructor(private apiService: SkillGamesApiService,
              private configService: ConfigService,
              private localStorageService: LocalStorageService,
              private commonDataService: CommonDataService) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<any> | any {
    const partners = this.localStorageService.get('skg_partners');
    if (partners) {
      this.commonDataService.setPartners(partners);
      return partners;
    } else {
      return this.apiService.apiPost("partners")
        .pipe(map(data => {
          let partners = [];
          if (data.ResponseCode === 0) {
            partners = data.ResponseObject.Entities;
            this.localStorageService.add('skg_partners', partners);
            this.commonDataService.setPartners(partners);
          }
          return partners;
        }));
    }
  }
}
