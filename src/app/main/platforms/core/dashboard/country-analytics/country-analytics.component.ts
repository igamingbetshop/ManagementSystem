import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";
import {HeaderFilterComponent} from "../../../../components/header-filter/header-filter.component";
import {Controllers, Methods} from "../../../../../core/enums";
import {take} from "rxjs/operators";
import {CoreApiService} from "../../services/core-api.service";
import {ConfigService} from "../../../../../core/services";
import {TranslateModule} from "@ngx-translate/core";
import {ProgressBarComponent} from "../progress-bar/progress-bar.component";
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { formatDateTime } from 'src/app/core/utils';


@Component({
  selector: 'app-country-analytics',
  templateUrl: './country-analytics.component.html',
  styleUrls: ['./country-analytics.component.scss'],
  standalone:true,
  imports: [
    CommonModule,
    HeaderFilterComponent,
    TranslateModule,
    ProgressBarComponent,
  ],
  providers: [DatePipe]
})
export class CountryAnalyticsComponent implements OnInit{
  topVisitors  = signal([]);
  topRegistrations  = signal([]);
  public filteredData;
  fromDate: any;
  public toDate: any;
  public partnerId;

  #apiService = inject(CoreApiService);
  #configService = inject(ConfigService);


  ngOnInit() {
    this.setTime();
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    if (event.partnerId) {
      this.partnerId = event.partnerId;
    } else {
      this.partnerId = null;
    }
    this.filteredData = this.getFilteredDate();
    this.getApiCalls();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = formatDateTime(fromDate);
    this.toDate = formatDateTime(toDate);    
  }

  getApiCalls(){
    this.getTopVisitors();
    this.getTopRegistrations()
  }

  getFilteredDate() {
    if (this.partnerId) {
      return {
        FromDate: this.fromDate,
        ToDate: this.toDate,
        PartnerId: this.partnerId
      };
    } else {
      return {
        FromDate: this.fromDate,
        ToDate: this.toDate
      };
    }
  }

  getTopVisitors() {
    this.filteredData = this.getFilteredDate();
    this.#apiService.apiPost(this.#configService.getApiUrl, this.filteredData,true,
      Controllers.DASHBOARD, Methods.GET_TOP_VISITORS, null, true).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.topVisitors.set(data.ResponseObject.slice(0,5));
        this.topVisitors().map(item => {
          item.Name = item.CountryName;
          item.Icon =  item.CountryCode ?  item.CountryCode.toLowerCase() : "";
          item.ImageUrl = '../../../../../../assets/images/flags/' + item.Icon + '.png';
          item.Amount = item.TotalCount;
        })
      }
    });
  }

  getTopRegistrations() {
    this.#apiService.apiPost(this.#configService.getApiUrl, this.filteredData,true,
      Controllers.DASHBOARD, Methods.GET_TOP_REGISTRATIONS, null, true).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.topRegistrations.set(data.ResponseObject.slice(0,5));
        this.topRegistrations().map(item => {
          item.Name = item.CountryName;
          item.Amount = item.TotalCount;
          item.Icon =  item.CountryCode ?  item.CountryCode.toLowerCase() : "";
          item.ImageUrl = '../../../../../../assets/images/flags/' + item.Icon + '.png';
          return item;
        })
      }
    });
  }

}

