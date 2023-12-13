import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersComponent } from './players.component';
import { PlayersRoutingModule } from './players-routing.module';
import { SportFilterOptionsResolver } from '../resolvers/sport-filter-options.resolver';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';


@NgModule({
  imports: [
    CommonModule,
    PlayersRoutingModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
  declarations: [PlayersComponent],
  providers: [
    SportFilterOptionsResolver,
  ]
})
export class PlayersModule { }
