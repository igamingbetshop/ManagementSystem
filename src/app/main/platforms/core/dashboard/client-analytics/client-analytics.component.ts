import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";
import {HeaderFilterComponent} from "../../../../components/header-filter/header-filter.component";
import {Controllers, Methods} from "../../../../../core/enums";
import {take} from "rxjs/operators";
import {CoreApiService} from "../../services/core-api.service";
import {ConfigService, LocalStorageService} from "../../../../../core/services";
import {DateTimeHelper} from "../../../../../core/helpers/datetime.helper";
import {TranslateModule} from "@ngx-translate/core";
import {ProgressBarComponent} from "../progress-bar/progress-bar.component";


@Component({
  selector: 'app-client-analytics',
  templateUrl: './client-analytics.component.html',
  styleUrls: ['./client-analytics.component.scss'],
  standalone:true,
  imports: [
    CommonModule,
    HeaderFilterComponent,
    TranslateModule,
    ProgressBarComponent
  ],
  providers: [DatePipe]
})
export class ClientAnalyticsComponent implements OnInit{

  topProfitableClients  = signal([]);
  topDamagingClients  = signal([]);
  topTurnoverClients  = signal([]);
  topBonusReceivers  = signal([]);
  topGrantedBonuses  = signal([]);
  topActiveClients  = signal([]);
  public filteredData;
  public fromDate = new Date();
  public toDate = new Date();
  public partnerId;
  public percent;
  public emptyBlock:boolean = false;

  #apiService = inject(CoreApiService);
  #configService = inject(ConfigService);
  #localStorage = inject(LocalStorageService);
  currencyId:string = this.#localStorage.get('user')?.CurrencyId;

  ngOnInit() {
    this.startDate();
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
    this.getTopProfitableMethods();
    this.getTopDamagingMethods();
    this.getTopTurnoverMethods();
    this.getTopActiveClients();
    this.getTopBonusReceivers();
    this.getTopGrantedBonuses();
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

  getTopProfitableMethods() {
    this.filteredData = this.getFilteredDate();
    this.#apiService.apiPost(this.#configService.getApiUrl, this.filteredData,true,
      Controllers.DASHBOARD, Methods.GET_TOP_PROFITABLE_CLIENTS, null, false).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        let total = 0;
        this.topProfitableClients.set(data.ResponseObject.slice(0,5));
        this.topProfitableClients().forEach((item) => {
          item.Name = item.UserName;
          item.CurrencyId = this.currencyId;
          item.Amount = item.GGR;
          total = total + Math.abs(item.Amount);
        });
        this.topProfitableClients().forEach((item) => {
          item.Percent = item.Amount * 100 / total;
        });
      /*  this.topProfitableClients.sort((a,b) => b.GGR - a.GGR);*/
        return this.topProfitableClients();
      }
    });
  }

  getTopDamagingMethods() {
    this.#apiService.apiPost(this.#configService.getApiUrl, this.filteredData,true,
      Controllers.DASHBOARD, Methods.GET_TOP_DAMAGING_CLIENTS, null, false).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        let total = 0;
        this.topDamagingClients.set(data.ResponseObject.slice(0,5));
        this.topDamagingClients().forEach((item) => {
          item.Name = item.UserName;
          item.CurrencyId = this.currencyId;
          item.Amount = item.GGR;
          total = total + item.Amount;
        });
        this.topDamagingClients().forEach((item) => {
          item.Percent = item.Amount * 100 / total;
        });
        return this.topDamagingClients();
      }
    });
  }

  getTopTurnoverMethods() {
    this.#apiService.apiPost(this.#configService.getApiUrl, this.filteredData,true,
      Controllers.DASHBOARD, Methods.GET_TOP_TURNOVER_CLIENTS, null, false).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        let total = 0;
        this.topTurnoverClients.set(data.ResponseObject.slice(0,5));
        this.topTurnoverClients().forEach((item) => {
          item.Name = item.UserName;
          item.CurrencyId = this.currencyId;
          item.Amount = item.TotalBetAmount;
          total = total + item.Amount;
        });
        this.topTurnoverClients().forEach((item) => {
          item.Percent = item.Amount * 100 / total;
        });
        return this.topTurnoverClients();
      }
    });
  }

  getTopActiveClients() {
    this.#apiService.apiPost(this.#configService.getApiUrl, this.filteredData,true,
      Controllers.DASHBOARD, Methods.GET_TOP_ACTIVE_CLIENTS, null, false).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        let total = 0;
        this.topActiveClients.set(data.ResponseObject.slice(0,5));
        this.topActiveClients().forEach((item) => {
          item.Name = item.UserName;
          item.Amount = Math.abs(item.TotalSessionTime);
          item.Hours =  Math.floor(item.Amount / 3600);
          item.Minutes = Math.floor((item.Amount % 3600) / 60);
          item.Seconds = Math.floor(item.Amount % 60);
          total = total + item.Amount;
        });
        this.topActiveClients().forEach((item) => {
          item.Percent = item.Amount * 100 / total;
        });
      }
    });
  }

  getTopBonusReceivers() {
    this.#apiService.apiPost(this.#configService.getApiUrl, this.filteredData,true,
      Controllers.DASHBOARD, Methods.GET_TOP_BONUS_RECEIVERS, null, false).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        let total = 0;
        this.topBonusReceivers.set(data.ResponseObject.slice(0,5));
        this.topBonusReceivers().forEach((item) => {
          item.Name = item.UserName;
          item.CurrencyId = this.currencyId;
          item.Amount = item.TotalBonusAmount;
          total = total + item.Amount;
        });
        this.emptyBlock = !total;
        this.topBonusReceivers().forEach((item) => {
          item.Percent = item.Amount * 100 / total;
        });
        return this.topBonusReceivers();
      }
    });
  }

  getTopGrantedBonuses() {
    this.#apiService.apiPost(this.#configService.getApiUrl, this.filteredData,true,
      Controllers.DASHBOARD, Methods.GET_TOP_GRANTED_BONUSES, null, false).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        let total = 0;
        this.topGrantedBonuses.set(data.ResponseObject.slice(0,5));
        this.topGrantedBonuses().forEach((item) => {
          item.Amount = item.MaxAmount;
          item.CurrencyId = this.currencyId;
          item.ClientId = item.Id;
          total = total + item.Amount;
        });
        this.emptyBlock = !total;
        this.topGrantedBonuses().forEach((item) => {
          item.Percent = item.Amount * 100 / total;
        });
        return this.topGrantedBonuses();
      }
    });
  }
}

