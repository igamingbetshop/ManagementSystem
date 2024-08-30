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
  selector: 'app-agent-analytics',
  templateUrl: './agent-analytics.component.html',
  styleUrls: ['./agent-analytics.component.scss'],
  standalone:true,
  imports: [
    CommonModule,
    HeaderFilterComponent,
    TranslateModule,
    ProgressBarComponent
  ],
  providers: [DatePipe]
})
export class AgentAnalyticsComponent implements OnInit{

  topAgentProfits = signal([]);
  topAgentDamages  = signal([]);
  public filteredData;
  public fromDate = new Date();
  public toDate = new Date();
  public partnerId;
  public percent;

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
    this.getTopAgentProfits();
    this.getTopAgentDamages()
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

  getTopAgentProfits() {
    this.filteredData = this.getFilteredDate();
    this.#apiService.apiPost(this.#configService.getApiUrl, this.filteredData,true,
      Controllers.DASHBOARD, Methods.GET_TOP_PROFITABLE_AGENTS, null, false).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        let total = 0;
        this.topAgentProfits.set(data.ResponseObject.slice(0,5));
        this.topAgentProfits().forEach((item) => {
          item.CurrencyId = this.currencyId;
          item.Name = item.FirstName;
          item.Amount = item.TotalGGR;
          item.ClientId = item.Id;
          total = total + item.Amount;
        });
        this.topAgentProfits().forEach((item) => {
          item.Percent = item.Amount * 100 / total;
        });
        return this.topAgentProfits();
      }
    });
  }

  getTopAgentDamages() {
    this.#apiService.apiPost(this.#configService.getApiUrl, this.filteredData,true,
      Controllers.DASHBOARD, Methods.GET_TOP_DAMAGING_AGENTS, null, false).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        let total = 0;
        this.topAgentDamages.set(data.ResponseObject.slice(0,5));
        this.topAgentDamages().forEach((item) => {
          item.CurrencyId = this.currencyId;
          item.Name = item.FirstName;
          item.Amount = item.TotalGGR;
          item.ClientId = item.Id;
          total = total + item.Amount;
        });
        this.topAgentDamages().forEach((item) => {
          item.Percent = item.Amount * 100 / total;
        });
      }
    });
  }

}

