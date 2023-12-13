import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-image-renderer',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  template: `<div  style="padding-left: 40px !important; padding-top: 5px !important;">
  <mat-icon (click)="onClick($event)" style="cursor: pointer">photo_size_select_actual</mat-icon>
</div>`
})
export class ImageRendererComponent implements ICellRendererAngularComp {
  params;
  agInit(params): void {
    this.params = params;
  }

  refresh(params?: any): boolean {
    return true;
  }
  onClick($event) {
    if (this.params.onClick instanceof Function) {

      this.params.onClick(this.params);

    }
  }
}
