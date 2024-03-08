import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `<div>
    <ng-container *ngIf="!this.icon">
  <button style="background-color: {{bgColor}}; color: {{textColor}}" [class.disabled]="isDisabled" mat-stroked-button (click)="onClick($event)" >
    {{label}}
  </button>
</ng-container>

<ng-container *ngIf="this.icon">
  <button  mat-mini-fab style="background-color: {{bgColor}}; color: {{textColor}}" [class.disabled]="isDisabled" (click)="onClick($event)" >
    <mat-icon>{{icon}}</mat-icon>
  </button>
</ng-container>
</div>


`,
  styles: ['button.disabled { color: rgb(186, 180, 180); }'],
})

export class ButtonRendererComponent implements ICellRendererAngularComp {

  params;
  label: any;
  bgColor;
  textColor;
  isDisabled: boolean;
  hover;
  icon;

  agInit(params): void {
    this.params = params;
    this.label = this.params.Label || null;
    this.bgColor = this.params.bgColor || null;
    this.textColor = this.params.textColor || null;
    this.isDisabled = this.params.isDisabled;
    this.hover = params.hover;
    this.icon = this.params.Icon
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
