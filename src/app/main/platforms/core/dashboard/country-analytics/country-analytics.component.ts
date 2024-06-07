import {Component, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";
import {HeaderFilterComponent} from "../../../../components/header-filter/header-filter.component";
import {Controllers, Methods} from "../../../../../core/enums";
import {take} from "rxjs/operators";
import {CoreApiService} from "../../services/core-api.service";
import {ConfigService} from "../../../../../core/services";
import {DateTimeHelper} from "../../../../../core/helpers/datetime.helper";
import {TranslateModule} from "@ngx-translate/core";
import {ProgressBarComponent} from "../progress-bar/progress-bar.component";


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
  public topVisitors;
  public topRegistrations;
  public filteredData;
  public fromDate = new Date();
  public toDate = new Date();
  public partnerId;

  constructor(
    private apiService: CoreApiService,
    public configService: ConfigService,
  ) {

  }


  ngOnInit() {
    this.startDate();
    this.getTopVisitors();
    this.getTopRegistrations();

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

  startDate(): void {
    DateTimeHelper.selectTime('week');
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
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
    this.apiService.apiPost(this.configService.getApiUrl, this.filteredData,true,
      Controllers.DASHBOARD, Methods.GET_TOP_VISITORS, null, false).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.topVisitors = data.ResponseObject.slice(0, 5).map(item => {
          item.Name = item.CountryName;
          item.Icon =  item.CountryCode ?  item.CountryCode.toLowerCase() : "";
          item.ImageUrl = '../../../../../../assets/images/flags/' + item.Icon + '.png';
          item.Amount = item.TotalCount;
          return item;
        })
      }
    });
  }

  getTopRegistrations() {
    this.apiService.apiPost(this.configService.getApiUrl, this.filteredData,true,
      Controllers.DASHBOARD, Methods.GET_TOP_REGISTRATIONS, null, false).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.topRegistrations = data.ResponseObject.slice(0, 5).map(item => {
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

