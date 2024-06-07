import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonDataResolver } from '../../core/resolvers/common-data.resolver';
import { VirtualGamesCommonComponent } from './vg-common.component';
import { VirtualGamesCommonRoutingModule } from './vg-common.routing.module';
import { VirtualGamesFilterOptionsResolver } from '../resolvers/virtual-games-filter-options.resolver';

@NgModule({
  imports: [
    CommonModule,
    VirtualGamesCommonRoutingModule,
  ],
  declarations: [VirtualGamesCommonComponent],
  providers: [
    CommonDataResolver,
    VirtualGamesFilterOptionsResolver
  ]
})
export class VirtualGamesCommonModule { }
