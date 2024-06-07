import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { CommonDataService } from 'src/app/core/services';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";

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
    MatNativeDateModule
  ],
  templateUrl: './header-filter.component.html',
  styleUrl: './header-filter.component.scss'
})
export class HeaderFilterComponent implements OnInit{
  title = input<string>();
  partners;
  fromDate = new Date();
  toDate = new Date();
  selectedItem = 'week';
  partnerId: number | undefined;
  @Output() toDateChange = new EventEmitter<any>();
  titleName: string = '';

  private translate = inject(TranslateService);
  private commonDataService = inject(CommonDataService);

  
  ngOnInit(): void {
    this.titleName = this.title();
    this.selectTime(this.selectedItem);
    this.partners = this.commonDataService.partners;
    this.translate.get(this.titleName).subscribe((translatedTitle: string) => {
      this.titleName = translatedTitle;
    }); 
  }


  startDate() {
    DateTimeHelper.startDate();
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
  }

  selectTime(time: string): void {
    DateTimeHelper.selectTime(time);
    this.fromDate = DateTimeHelper.getFromDate();
    this.toDate = DateTimeHelper.getToDate();
    this.selectedItem = time;
    this.getCurrentPage();
  }

  onStartDateChange(event) {
    this.fromDate = event.value;
    this.getCurrentPage();
  }

  onEndDateChange(event) {
    this.toDate = event.value;
    this.getCurrentPage();
  }

  onPartnerChange(partnerId: number) {
    this.partnerId = partnerId;
    this.getCurrentPage();
  }

  getCurrentPage() {
    this.toDateChange.emit({ fromDate: this.fromDate, toDate: this.toDate, partnerId: this.partnerId });
  }
  
}
