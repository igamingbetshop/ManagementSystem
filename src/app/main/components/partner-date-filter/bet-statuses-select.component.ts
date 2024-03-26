import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-bet-status-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    TranslateModule
  ],
  template: `
      <div class="partner-dropdown">
      <mat-select 
        [(ngModel)]="availableStatusesStatus"
        (selectionChange)="betStatusChange($event.value)"
        panelClass="overlay-dropdown"
        [ngModelOptions]="{standalone: true}"
        disableOptionCentering>
        @for (_status of availableStatuses; track _status.Id) {
        <mat-option [value]="_status.Status">{{_status.Name | translate}}</mat-option>
        }
      </mat-select>
    </div>
  `,
  styleUrls: ['./partner-date-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BetStatusesComponent {

  @Output() toBetStatusChange = new EventEmitter<any>();

  availableStatusesStatus: number = -1;
  public availableStatuses = [
    {Id: '1', Status: -1, Name: 'Common.All'},
    {Id: '2', Status: 0, Name: 'Common.Prematch'},
    {Id: '3', Status: 1, Name: 'Common.Live'}
  ]

  betStatusChange(event: number) {
    this.toBetStatusChange.emit(event);
  }

}