import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {ConfigService} from "../../../../core/services/config.service";
import {map} from "rxjs/operators";
import {LocalStorageService} from "../../../../core/services/local-storage.service";
import {FilterService} from "../../../../core/services/filter.service";
import { SportsbookApiService } from '../services/sportsbook-api.service';


@Injectable()
export class SportFilterOptionsResolver implements Resolve<any>
{
  constructor(private apiService:SportsbookApiService,
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
      return this.apiService.apiPost('common/filteroperations')
      .pipe(map(data => {
          let filterOptions = [];
          if( data.Code === 0)
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