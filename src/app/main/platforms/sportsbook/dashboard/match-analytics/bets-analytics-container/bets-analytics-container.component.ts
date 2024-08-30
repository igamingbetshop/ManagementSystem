import {Component, input, signal} from '@angular/core';
import {BetsAnalyticsComponent} from "./bets-analytics/bets-analytics.component";
import {MarketBetsComponent} from "./market-bets/market-bets.component";
import {TranslateModule} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-bets-analytics-container',
  standalone: true,
  imports: [BetsAnalyticsComponent, MarketBetsComponent, TranslateModule, MatIconModule],
  templateUrl: './bets-analytics-container.component.html',
  styleUrl: './bets-analytics-container.component.scss'
})
export class BetsAnalyticsContainerComponent {
  type = input.required();
  dateFilter = input.required();
  selectedMatch = signal<any>({Id:0});

  goBack()
  {
    this.selectedMatch.set({Id:0});
  }
}
