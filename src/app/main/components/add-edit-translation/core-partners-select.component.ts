import { Component, EventEmitter, OnInit, Output, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonDataService } from 'src/app/core/services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-select-device-type',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    TranslateModule
  ],
  template: `
      <div class="partner-dropdown">
      <mat-select (selectionChange)="onSelectionChange($event.value)" [(ngModel)]="binding"  placeholder="{{'Common.SelectDeviceType' | translate}}"
        panelClass="overlay-dropdown" disableOptionCentering>
        @for (device of devices; track device.Id) {
        <mat-option [value]="device.Id">{{device.Name}}</mat-option>
        }
      </mat-select>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class SelectDeviceTypeComponent {

  devices: any[] = [
    { Id: 1, Name: "Desktop" },
    { Id: 2, Name: "Mobile" },  
  ];

  binding = 1;

  @Output() toDeviceChange = new EventEmitter<any>();


  onSelectionChange(event) {
    this.toDeviceChange.emit(event);
  }
 
}