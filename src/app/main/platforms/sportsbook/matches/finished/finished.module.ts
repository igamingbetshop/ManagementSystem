import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinishedComponent } from './finished.component';
import { FinishedRoutingModule } from './finished-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FinishedRoutingModule,
  ],
  declarations: [FinishedComponent],
})
export class FinishedModule { }
