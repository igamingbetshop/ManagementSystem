import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainRoutingModule} from './main-routing.module';
import {MainComponent} from './components/main/main.component';
import {HeaderComponent} from './components/header/header.component';
import {LeftMenuComponent} from './components/left-menu/left-menu.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";

import {MatButtonModule} from "@angular/material/button";

import {MatInputModule} from "@angular/material/input";

import {MatFormFieldModule} from "@angular/material/form-field";

import {MatListModule} from "@angular/material/list";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatExpansionModule} from '@angular/material/expansion';
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {LeftMenuItemsComponent,} from "./components/left-menu/left-menu-items/left-menu-items.component";
import {CoreSignalRService} from './platforms/core/services/core-signal-r.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {SportsbookSignalRService} from './platforms/sportsbook/services/signal-r/sportsbook-signal-r.service';
import {SignalRFactory} from './platforms/sportsbook/reports/business-intelligence/by-bets/by-bets.module';
import {ConfigService} from '../core/services';


@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    LeftMenuComponent,
    LeftMenuItemsComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,
    FormsModule,
    TranslateModule,
    MatMenuModule,
    MatSnackBarModule,
  ],
  providers: [
    {
      provide: SportsbookSignalRService,
      useFactory: SignalRFactory,
      deps: [ConfigService]
    }
  ]
})
export class MainModule {

}
