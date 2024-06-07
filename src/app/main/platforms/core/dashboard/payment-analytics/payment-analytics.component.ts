import {Component, OnInit} from '@angular/core';
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
  selector: 'app-payment-analytics',
  templateUrl: './payment-analytics.component.html',
  styleUrls: ['./payment-analytics.component.scss'],
  standalone:true,
  imports: [
    CommonModule,
    HeaderFilterComponent,
    TranslateModule,
    ProgressBarComponent
  ],
  providers: [DatePipe]
})
export class PaymentAnalyticsComponent implements OnInit{
  public topDeposits;
  public topWithdraws;
  public filteredData;
  public fromDate = new Date();
  public toDate = new Date();
  public partnerId;
  public percent;

  constructor(
    private apiService: CoreApiService,
    public configService: ConfigService,
    public localStorage: LocalStorageService
  ) {

  }


  ngOnInit() {
    this.startDate();
    this.getTopDepositMethods();
    this.getTopWithdrawMethods();

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
    this.getTopDepositMethods();
    this.getTopWithdrawMethods()
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

  getTopDepositMethods() {
    this.filteredData = this.getFilteredDate();
    this.apiService.apiPost(this.configService.getApiUrl, this.filteredData,true,
      Controllers.DASHBOARD, Methods.GET_TOP_DEPOSIT_METHODS, null, false).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        let total = 0;
        this.topDeposits = data.ResponseObject.slice(0, 5);
        this.topDeposits.forEach((item) => {
          item.CurrencyId = this.localStorage.get('user')?.CurrencyId;
          item.Name = item.PaymentSystemName;
          item.Amount = item.TotalAmount;
          item.Icon = item.PaymentSystemId;
          item.ImageUrl = '../../../../../../assets/images/payments/' + item.Icon + '.png';
          total = total + item.Amount;
        });
        this.topDeposits.forEach((item) => {
          item.Amount = item.TotalAmount;
          item.Percent = item.Amount * 100 / total;
        });
        return this.topDeposits;
      }
    });
  }

  getTopWithdrawMethods() {
    this.apiService.apiPost(this.configService.getApiUrl, this.filteredData,true,
      Controllers.DASHBOARD, Methods.GET_TOP_WITHDRAW_METHODS, null, false).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        let total = 0;
        this.topWithdraws = data.ResponseObject.slice(0, 5);
        this.topWithdraws.forEach((item) => {
          item.CurrencyId = this.localStorage.get('user')?.CurrencyId;
          item.Name = item.PaymentSystemName;
          item.Amount = item.TotalAmount;
          item.Icon = item.PaymentSystemId;
          item.ImageUrl = '../../../../../../assets/images/payments/' + item.Icon + '.png';
          total = total + item.Amount;
        });
        this.topWithdraws.forEach((item) => {
          item.Percent = item.Amount * 100 / total;
        });
      }
    });
  }

}

