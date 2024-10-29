import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { CommonDataService } from 'src/app/core/services';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { parseDateTimeString } from 'src/app/core/utils';
import { DateTimePickerComponent } from "../data-time-picker/data-time-picker.component";

@Component({
  selector: 'app-header-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    TranslateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DateTimePickerComponent
],
  templateUrl: './header-filter.component.html',
  styleUrl: './header-filter.component.scss'
})
export class HeaderFilterComponent implements OnInit{
  title = input<string>();
  partners = signal<any>(null);
  fromDate = signal<any>(null);
  toDate = signal<any>(null);
  selectedItem = signal<string>('week');
  partnerId: number | undefined;
  toDateChange = output<any>();
  titleName = signal<string>('');

  private translate = inject(TranslateService);
  private commonDataService = inject(CommonDataService);

  
  ngOnInit(): void {
    this.titleName.set(this.title());
    this.selectTime(this.selectedItem());
    this.partners.set(this.commonDataService.partners);
    this.translate.get(this.titleName()).subscribe((translatedTitle: string) => {
      this.titleName.set(translatedTitle);
    }); 
  }

  startDate() {
    DateTimeHelper.startDate();
    this.fromDate.set((DateTimeHelper.getFromDate()));
    this.toDate.set((DateTimeHelper.getToDate()));
  }

  selectTime(time: string): void {
    DateTimeHelper.selectTime(time);
    this.fromDate.set((DateTimeHelper.getFromDate()));
    this.toDate.set((DateTimeHelper.getToDate()));
    this.selectedItem.set(time);
    this.getCurrentPage();
  }

  onStartDateChange(event) {
    if (event instanceof Date) {
      this.fromDate.set(event);
    } else {
      const formattedDateTime = event;
      this.fromDate.set(parseDateTimeString(formattedDateTime));
    }
  }

  onEndDateChange(event) {
    if (event instanceof Date) {
      this.toDate.set(event);
    } else {
      const formattedDateTime = event;
      this.toDate.set(parseDateTimeString(formattedDateTime));
    }
  }

  onPartnerChange(partnerId: number) {
    this.partnerId = partnerId;
    this.getCurrentPage();
  }

  getCurrentPage() {
    const formattedFromDate = this.formatDateTime(this.fromDate());
    const formattedToDate = this.formatDateTime(this.toDate());
    this.toDateChange.emit({ fromDate: formattedFromDate, toDate: formattedToDate, partnerId: this.partnerId });
  }

  formatDateTime(date: any): string {
    if (date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    return '';
  }
  
}
