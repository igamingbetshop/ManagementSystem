import {Component, inject, input, output, signal} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {ProgressBarComponent} from "../../../progress-bar/progress-bar.component";
import {TranslateModule} from "@ngx-translate/core";
import {take} from "rxjs/operators";
import {SportsbookApiService} from "../../../../services/sportsbook-api.service";
import {LoaderService, LocalStorageService} from "../../../../../../../core/services";

@Component({
  selector: 'app-market-bets',
  standalone: true,
  imports: [
    MatIconModule,
    ProgressBarComponent,
    TranslateModule
  ],
  templateUrl: './market-bets.component.html',
  styleUrl: './market-bets.component.scss'
})
export class MarketBetsComponent {

  markets  = signal([]);
  #apiService = inject(SportsbookApiService);
  #localStorage = inject(LocalStorageService);
  loader = inject(LoaderService);
  currencyId:string = this.#localStorage.get('user')?.CurrencyId;
  emptyBlock= signal<boolean>(false);
  type = input.required();

  match = input(0, {transform: (match:any) => {
    if(!match.Id)
      this.markets.set([]);
    else this.onMatchChanged(match);
    return match;
    }});
  dateFilter = input.required({transform:date => {
      this.onFilterChanged(date);
      return date;
    }});

  onMatchChanged(match:any)
  {
    this.getBets({...match,...{PartnerId:this.dateFilter()['PartnerId']}});
  }

  onFilterChanged(filter:any)
  {
    this.getBets({...this.match(),...{PartnerId:filter['PartnerId']}});
  }

  getBets(match:any) {
    if (this.type() === 'topturnovermatches') {
      match.FieldNameToOrderBy = 'BetAmount';
    } else if (this.type() === 'topprofitablematches') {
      match.FieldNameToOrderBy = 'ProfitAmount';
    } else {
      match.FieldNameToOrderBy = '';
    }
    match.MatchId = match.Id
    this.#apiService.apiPost('dashboard/topmarketbets', match).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        let total = 0;
        let totalAbs = 0;
        this.markets.set(data.ResponseObject.slice(0, 5));
        this.markets().forEach((item) => {
          if(this.type() === 'topturnovermatches'){
            item.Amount = item.BetAmount;
          } else{
            item.Amount = item.Profit;
          }
          item.MatchName = item.MarketName;
          item.SportName = item.MarketId;
          item.CurrencyId = this.currencyId;
          if(item.Amount >= 0){
            total = total + item.Amount;
          } else {
            totalAbs = totalAbs + item.Amount;
          }
        });
        this.emptyBlock.set(!total);
        this.markets().forEach((item) => {
          if(item.Amount >= 0){
            item.Percent = item.Amount * 100 / total;
          } else {
            item.Percent = item.Amount * 100 / totalAbs;
            item.Percent = Math.abs(item.Percent)
          }
        });
      }
    });
  }
}
