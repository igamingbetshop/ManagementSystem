import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-core-payments-select',
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
        (selectionChange)="getByPaymentData($event.value)"
        placeholder="{{'Partners.SelectPayment' | translate}}"
        panelClass="overlay-dropdown"
        disableOptionCentering>
      <mat-option *ngFor="let payment of payments" [value]="payment.Id">{{payment.Name}}</mat-option>
    </mat-select>
    </div>
  `,
  styleUrls: ['./partner-date-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CorePaymentsSelectComponent {

  public payments = [
    { Id: 1, Name: 'Withdraw' },
    { Id: 2, Name: 'Deposit' }
  ];
  @Output() onPaymentsChange = new EventEmitter<any>();

  paymentsId: number | undefined;

  getByPaymentData(event: number) {
    this.paymentsId = event;
    this.onPaymentsChange.emit(this.paymentsId);
  }

}