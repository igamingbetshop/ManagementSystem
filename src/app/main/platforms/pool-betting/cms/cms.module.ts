import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsComponent } from './cms.component';
import { CmsRoutingModule } from './cms-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CmsRoutingModule,
  ],
  declarations: [CmsComponent],
  providers: [
  ]
})
export class CmsModule { }
