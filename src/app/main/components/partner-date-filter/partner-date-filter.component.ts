import { Component, EventEmitter, OnInit, Output, ViewEncapsulation, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from "@angular/material/core";
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DateHelper } from './data-helper.class';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CoreAccountsSelectComponent } from "./core-accounts-select.component";
import { CorePartnersSelectComponent } from './core-partners-select.component';
import { BetCategoryComponent } from './bet-category-select.component';
import { BetStatusesComponent } from './bet-statuses-select.component';
import { CorePaymentsSelectComponent } from './core-payments-select.component';
import { SportPartnersSelectComponent } from './sport-partners-select.component';
import { SportSelectComponent } from './sport-select.component';
import { DateTimePickerComponent } from "../data-time-picker/data-time-picker.component";
import { BetShopsesComponent } from "./bet-shops-select.component";

@Component({
    selector: 'app-partner-date-filter',
    standalone: true,
    templateUrl: './partner-date-filter.component.html',
    styleUrls: ['./partner-date-filter.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatNativeDateModule,
        TranslateModule,
        PartnerDateFilterComponent,
        CorePartnersSelectComponent,
        CoreAccountsSelectComponent,
        CorePaymentsSelectComponent,
        SportSelectComponent,
        BetStatusesComponent,
        BetCategoryComponent,
        SportPartnersSelectComponent,
        DateTimePickerComponent,
        BetShopsesComponent
    ]
})
export class PartnerDateFilterComponent implements OnInit {

  title = input<string>();
  partners = input<string>();
  hasPeyments = input<boolean>();
  sportChange = input<boolean>();
  checkBoxText = input<string | undefined>();
  accounts = input<any>();
  pageIdName = input<string>();
  porviders = input<string>();
  betCategory = input<boolean>();
  betStatuses = input<boolean>();
  allTimesFilter = input<boolean>(true);
  liveUpdateBTN = input<boolean>();
  isReconnected = input<boolean>(false);
  lastYearFilter = input(false);
  betShopGroups = input();
  @Output() toDateChange = new EventEmitter<any>();
  @Output() startDateChange = new EventEmitter<any>();
  @Output() titleClick = new EventEmitter<any>();
  @Output() checkBoxClick = new EventEmitter<any>();
  @Output() accountTypeChange = new EventEmitter<any>();
  @Output() paymentChange = new EventEmitter<any>();
  @Output() toSportChange = new EventEmitter<number>();
  @Output() providerChange = new EventEmitter<number>();
  @Output() betCategoryChange = new EventEmitter<number>();
  @Output() betStatusesChange = new EventEmitter<number>();
  @Output() onLiveUpdateBTN = new EventEmitter<boolean>();
  @Output() betShopChange = new EventEmitter<number>();
  titleName: string = '';
  fromDate: Date | undefined;
  toDate: Date | undefined;
  partnerId: number | undefined;
  selectedItem: string = 'today';
  checkBoxTextTranslated: string = '';
  isLiveUpdateOn: boolean = false;
  private translate = inject(TranslateService);

  ngOnInit(): void {
    console.log(this.betShopGroups(), "this.betShopGroups");
    
    this.startDate();
    if (this.title) {
      this.titleName = this.title();
        this.translate.get(this.titleName).subscribe((translatedTitle: string) => {
          this.titleName = translatedTitle;
        });  
    }
    if (this.checkBoxText()) {

      this.checkBoxTextTranslated = this.checkBoxText();
      this.translate.get(this.checkBoxTextTranslated).subscribe((translatedTitle: string) => {
        this.checkBoxTextTranslated = translatedTitle;
      });
    }
  }

  formatDateTime(date: any): string {
    if (date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    return '';
  }

  startDate() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  selectTime(time: string): void {
    const [fromDate, toDate] = DateHelper.selectTime(time);
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.selectedItem = time;
    this.getCurrentPage();
  }

  onStartDateChange(event: any) {
    if (event instanceof Date) {
      this.fromDate = event;
    } else {
      const formattedDateTime = event;
      this.fromDate = this.parseDateTimeString(formattedDateTime);
    }
  }

  onEndDateChange(event: any) {
    if (event instanceof Date) {
      this.toDate = event;
    } else {
      const formattedDateTime = event;
      this.toDate = this.parseDateTimeString(formattedDateTime);
    }
  }

  private parseDateTimeString(dateTimeString: string): Date {
    const dateTimeParts = dateTimeString.split('T');
    if (dateTimeParts.length === 2) {
      const [datePart, timePart] = dateTimeParts;
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes);
    }
    return new Date();
  }

  getByPartnerData(event: any) {
    this.partnerId = event;
    this.getCurrentPage();
  }

  onSportChange(event: number) {
    this.toSportChange.emit(event);
  }

  getCurrentPage() {
    this.toDateChange.emit({ fromDate: this.fromDate, toDate: this.toDate, partnerId: this.partnerId });
  }

  onDropdownOpen(ev: any, dropdownContent: any) {
    // Implement your logic to handle dropdown open events
  }

  onBetCategoryChange(event: number) {
    this.betCategoryChange.emit(event);
  }

  onBetStatusChange(event: number) {
    this.betStatusesChange.emit(event);
  }

  onTitleClick() {
    this.titleClick.emit(true);
  }

  onCheckBoxClick(event) {
    this.checkBoxClick.emit(event.checked)
  }

  onPaymentsChange(event) {
    this.paymentChange.emit(event);
  }

  onAccountTypeChange(event) {
    this.accountTypeChange.emit(event);
  }

  onProviderChange(event) {
    this.providerChange.emit(event);
  }

  onBetShopChange(event) {
    this.betShopChange.emit(event);
  }

  toggleLiveUpdate() {
    this.isLiveUpdateOn = !this.isLiveUpdateOn;
    this.onLiveUpdateBTN.emit(this.isLiveUpdateOn);
  }

}