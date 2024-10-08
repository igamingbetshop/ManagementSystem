import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonDataResolver } from '../../core/resolvers/common-data.resolver';
import { PBCommonRoutingModule } from './pb-common.routing.module';
import { PBCommonComponent } from './pb-common.component';

@NgModule({
  imports: [
    CommonModule,
    PBCommonRoutingModule,
  ],
  declarations: [PBCommonComponent],
  providers: [
    CommonDataResolver,
  ]
})
export class PBCommonModule { }
