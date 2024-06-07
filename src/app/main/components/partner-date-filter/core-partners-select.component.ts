import { Component, EventEmitter, OnInit, Output, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonDataService } from 'src/app/core/services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-core-partners-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    TranslateModule
  ],
  template: `
      <div class="partner-dropdown">
      <mat-select (selectionChange)="getByPartnerData($event.value)" placeholder="{{'Partners.SelectPartner' | translate}}"
        panelClass="overlay-dropdown" disableOptionCentering>
        <mat-option [value]="null">{{'Partners.SelectPartner' | translate }}</mat-option>
        @for (partner of partners; track partner.Id) {
        <mat-option [value]="partner.Id">{{partner.Name}}</mat-option>
        }
      </mat-select>
    </div>
  `,
  styleUrls: ['./partner-date-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CorePartnersSelectComponent implements OnInit {

  partners: any[];
  @Output() toPartnerChange = new EventEmitter<any>();
  partnerId: number | undefined;

  private commonDataService = inject(CommonDataService);

  ngOnInit(): void {
    this.partners = this.commonDataService.partners;
  }

  getByPartnerData(event: number) {
    this.partnerId = event;
    this.toPartnerChange.emit(this.partnerId);
  }

}