import {Component, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {HeaderFilterComponent} from "../../../../components/header-filter/header-filter.component";
import {ConfigService, LocalStorageService} from "../../../../../core/services";
import {DateTimeHelper} from "../../../../../core/helpers/datetime.helper";
import {SportsbookApiService} from "../../services/sportsbook-api.service";
import {ProgressBarComponent} from "../progress-bar/progress-bar.component";
import {MatIconModule} from "@angular/material/icon";
import {BetsAnalyticsContainerComponent} from "./bets-analytics-container/bets-analytics-container.component";


@Component({
  selector: 'app-match-analytics',
  templateUrl: './match-analytics.component.html',
  styleUrls: ['./match-analytics.component.scss'],
  standalone:true,
  imports: [
    CommonModule,
    TranslateModule,
    HeaderFilterComponent,
    ProgressBarComponent,
    MatIconModule,
    BetsAnalyticsContainerComponent
  ],
  providers: [DatePipe]
})
export class MatchAnalyticsComponent implements OnInit{

  public fromDate = new Date();
  public toDate = new Date();
  public partnerId;
  public filteredData;
  public percent;

  constructor(
    public configService: ConfigService,
    public localStorage: LocalStorageService,
  ){

  }

  ngOnInit() {

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
  }

  startDate(): void {
    DateTimeHelper.selectTime('week');
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
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
}

