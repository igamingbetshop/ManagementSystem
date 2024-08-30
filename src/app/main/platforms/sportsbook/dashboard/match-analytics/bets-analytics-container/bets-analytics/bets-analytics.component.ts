import {Component, inject, input, signal, output} from '@angular/core';
import {SportsbookApiService} from "../../../../services/sportsbook-api.service";
import {LoaderService, LocalStorageService} from "../../../../../../../core/services";
import {ProgressBarComponent} from "../../../progress-bar/progress-bar.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-bets-analytics',
  standalone: true,
  imports: [ProgressBarComponent, TranslateModule, NgIf],
  templateUrl: './bets-analytics.component.html',
  styleUrl: './bets-analytics.component.scss'
})
export class BetsAnalyticsComponent{

  method:string;
  type = input.required();
  dateFilter = input.required({transform:filter => {
      this.getMatches(filter);
      return filter;
    }});
  matches  = signal([]);
  onSelectMatch = output<any>();
  selectedMatch = signal<any>({Id:0});

  #apiService = inject(SportsbookApiService);
  #localStorage = inject(LocalStorageService);
  loader = inject(LoaderService);
  currencyId:string = this.#localStorage.get('user')?.CurrencyId;
  loading = false;

  constructor() {
    this.loader.isLoading.subscribe((v) => {
      this.loading = v;
    });
  }

  getMatches(filter:any)
  {
    if (this.type() === 'topturnovermatches') {
      filter.FieldNameToOrderBy = 'BetAmount';
    } else if (this.type() === 'topprofitablematches') {
      filter.FieldNameToOrderBy = 'ProfitAmount';
    } else {
      filter.FieldNameToOrderBy = '';
    }
    this.#apiService.apiPost(`dashboard/${this.type()}`, filter).subscribe(data => {
      if (data.Code === 0) {
        let total = 0;
        let totalAbs = 0;
        const matches = data.ResponseObject.Matches;

        if(matches.length > 0)
        {
          this.matches.set(data.ResponseObject.Matches.slice(0,5));

          if(window.matchMedia("(min-width: 1200px)").matches)
          {
            this.selectMarket(this.matches()[0]);
          }
          this.matches().forEach((item) => {
            if(this.type() === 'topturnovermatches')
            {
              item.Amount = item.BetAmount;
            } else{
              item.Amount = item.ProfitAmount;
            }

            item.CurrencyId = this.currencyId;
            if(item.Amount >= 0){
              total = total + item.Amount;
            } else {
              totalAbs = totalAbs + item.Amount;
            }
          });
          this.matches().forEach((item) => {
            if(item.Amount >= 0){
              item.Percent = item.Amount * 100 / total;
            } else {
              item.Percent = item.Amount * 100 / totalAbs;
              item.Percent = Math.abs(item.Percent)
            }
          });
        }
        else{
          this.matches.set([]);
          this.selectMarket({Id:0});
        }

      }
    });
  }

  selectMarket(match:any)
  {
    const m = {Id:match.MatchId, ProfitAmount:match.ProfitAmount, BetAmount:match.BetAmount};
    this.selectedMatch.set(m);
    this.onSelectMatch.emit(m);
  }
}
