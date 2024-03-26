import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ByBetsComponent } from './by-bets.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { OddsTypePipe } from "../../../../../../core/pipes/odds-type.pipe";
import { MatInputModule } from "@angular/material/input";
import { ConfigService } from "../../../../../../core/services";
import { SportsbookSignalRNewService } from "../../../services/signal-r/sportsbook-signal-r-new.service";
import { SportsBookSignalROldService } from "../../../services/signal-r/sportsbook-signal-r-old.service";
import { SportsbookSignalRService } from "../../../services/signal-r/sportsbook-signal-r.service";
import { MatIconModule } from '@angular/material/icon';
import { MatchGridComponent } from './match-grid/match-grid.component';
import { PartnerDateFilterComponent } from "../../../../../components/partner-date-filter/partner-date-filter.component";


const routes: Routes = [
  {
    path: '',
    component: ByBetsComponent,
  }
];

@NgModule({
    declarations: [ByBetsComponent, MatchGridComponent],
    providers: [
        DatePipe,
        SportsBookSignalROldService,
        DecimalPipe,
        OddsTypePipe, {
            provide: SportsbookSignalRService,
            useFactory: SignalRFactory,
            deps: [ConfigService]
        }
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        MatSnackBarModule,
        TranslateModule,
        FormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDialogModule,
        ReactiveFormsModule,
        AgGridModule,
        MatInputModule,
        MatIconModule,
        PartnerDateFilterComponent
    ]
})
export class ByBetsModule { }

export function SignalRFactory(configService: ConfigService) {
  if (configService.isSignalRCore == true) {
    return new SportsbookSignalRNewService(configService);
  }
  return new SportsBookSignalROldService(configService);
}
