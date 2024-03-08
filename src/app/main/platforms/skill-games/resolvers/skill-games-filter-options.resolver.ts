import {Injectable} from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import {ConfigService, LocalStorageService} from "../../../../core/services";
import {FilterService} from "../../../../core/services/filter.service";
import {map} from "rxjs/operators";
import {SkillGamesApiService} from "../services/skill-games-api.service";


@Injectable()
export class SkillGamesFilterOptionsResolver  {
  constructor(private apiService: SkillGamesApiService,
              private configService: ConfigService,
              private localStorageService: LocalStorageService,
              private filterService: FilterService) {

  }

  resolve(route: ActivatedRouteSnapshot): Promise<any> | any {
    const filterOptions = this.localStorageService.get('filter-options');
    if (filterOptions) {
      this.filterService.initFilterOptions(filterOptions);
      return filterOptions;
    } else {
      return this.apiService.apiPost('common/filteroperations')
        .pipe(map(data => {
          let filterOptions = [];
          if (data.ResponseCode === 0) {
            filterOptions = data.ResponseObject;
            this.localStorageService.add('filter-options', filterOptions);
            this.filterService.initFilterOptions(filterOptions);
          }
          return filterOptions;
        }));
    }
  }
}
