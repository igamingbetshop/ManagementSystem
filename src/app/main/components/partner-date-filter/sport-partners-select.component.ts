import { Component, EventEmitter, OnInit, Output, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { SportsbookApiService } from '../../platforms/sportsbook/services/sportsbook-api.service';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sport-partners-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
  ],
  template: `
      <div class="partner-dropdown">
      <mat-select [(ngModel)]='partnerId' (selectionChange)="getByPartnerData($event.value)" placeholder="{{'SelectPartner'}}"
        panelClass="overlay-dropdown" disableOptionCentering>
        <mat-option [value]="null">{{'SelectPartner'}}</mat-option>
        @for (partner of partners; track partner.Id) {
        <mat-option [value]="partner.Id">{{partner.Name}}</mat-option>
        }
      </mat-select>
    </div>
  `,
  styleUrls: ['./partner-date-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SportPartnersSelectComponent implements OnInit {

  partners: any[];
  @Output() toPartnerChange = new EventEmitter<any>();
  partnerId: number = 1;

  private apiService = inject(SportsbookApiService);
  private _snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.getPartners();
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  getByPartnerData(event: number) {
    this.partnerId = event;
    this.toPartnerChange.emit(this.partnerId);
  }

}