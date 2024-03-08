import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {ConfigService} from "../../../../core/services/config.service";
import {Controllers, Methods} from "../../../../core/enums";
import {map} from "rxjs/operators";
import {LocalStorageService} from "../../../../core/services/local-storage.service";
import {FilterService} from "../../../../core/services/filter.service";
import {CoreApiService} from "../services/core-api.service";

@Injectable()
export class FilterOptionsResolver 
{
  constructor(private apiService:CoreApiService,
              private configService:ConfigService,
              private localStorageService:LocalStorageService,
              private filterService:FilterService)
  {

  }

  resolve(route: ActivatedRouteSnapshot): Promise<any> | any
  {
    const filterOptions = this.localStorageService.get('filter-options');
    if(filterOptions)
    {
      this.filterService.initFilterOptions(filterOptions);
      return filterOptions;
    }
    else
    {
      return this.apiService.apiPost(this.configService.getApiUrl,
        null, true, Controllers.ENUMERATION, Methods.GET_FILTER_OPTIONS).pipe(map(data => {
          let filterOptions = [];
          if( data.ResponseCode === 0)
          {
            filterOptions = data.ResponseObject;
            this.localStorageService.add('filter-options', filterOptions);
            this.filterService.initFilterOptions(filterOptions);
          }
          return  filterOptions;
      }));
    }
  }
}
