import { Component, Optional, Self, OnInit, OnDestroy, ElementRef, ViewChild, Input, Output, EventEmitter, Renderer2, OnChanges, SimpleChanges, output, input } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import flatpickr from 'flatpickr';
import { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-date-time-picker',
  template: `
    <input
      class="data-time-input"
      matInput
      [value]="dateTime()"
      #inputElement      
      (blur)="onBlur()"
      [placeholder]="placeholder"
    >  `,
  styles: [`
    :host {
      width: 100%;
      input {
        height: 32px;
        cursor: pointer !important;
        border: 1px solid $gray-light;
        border-radius: 8px;
        background-color: $gray-light-13;
        border-radius: 8px;
        color: $gray-light-15;
        transition: background-color 0.3s, color 0.3s;
        font-size: 14px;
        border: none;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: DateTimePickerComponent,
    },
  ],
})
export class DateTimePickerComponent implements ControlValueAccessor, MatFormFieldControl<string>, OnChanges, OnInit, OnDestroy {
  static nextId = 0;
  formatType = input <'full' | 'date-only' | 'hour'>('full');
  dateTime = input< string | null>(null);
  placholderText = input<string>('Common.SelectDateAndTime');
  dateTimeChange = output<string>();
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'app-date-time-picker';
  id = `app-date-time-picker-${DateTimePickerComponent.nextId++}`;
  describedBy = '';
  onChange = (value: string) => { };
  onTouched = () => { };
  @ViewChild('inputElement', { static: true }) inputElement!: ElementRef<HTMLInputElement>;
  value: string | null = null;
  placeholder: string = '';
  required: boolean = false;
  disabled: boolean = false;
  errorState: boolean = false;
  autofilled?: boolean;
  userAriaDescribedBy?: string;
  private flatpickrInstance: FlatpickrInstance | null = null;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private translate: TranslateService,
    private fm: FocusMonitor,
    private renderer: Renderer2,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dateTime'] && this.flatpickrInstance) {
      this.flatpickrInstance.setDate(this.dateTime() ? new Date(this.dateTime()) : null, true);
    }
  }

  ngOnInit() {
    this.initializeFlatpickr();
    this.setPlaceholder();
  }

  setPlaceholder() {
    if(!this.placholderText())
      this.placeholder = this.translate.instant('Common.SelectDateAndTime');
      if (this.formatType() === 'date-only') {
        this.placeholder = this.translate.instant('Common.SelectDate');
      } else if (this.formatType() === 'hour') {
        this.placeholder = this.translate.instant('Common.SelectTime');
        this.hideSecondNumInputWrapper();
      } else {
        this.placeholder = this.placholderText();
      }
  }

  private hideSecondNumInputWrapper() {
    const numInputWrappers = document.querySelectorAll('.numInputWrapper');
    if (numInputWrappers.length > 2) {
      this.renderer.setStyle(numInputWrappers[2], 'display', 'none');
    }
  }

  ngAfterViewInit() {
    this.fm.monitor(this.inputElement.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngOnDestroy() {
    this.fm.stopMonitoring(this.inputElement.nativeElement);
    this.stateChanges.complete();
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }

  private initializeFlatpickr() {
    const options: any = {
      enableTime: this.formatType() !== 'date-only',
      noCalendar: this.formatType() === 'hour',
      dateFormat: this.formatType() === 'hour' ? 'Y-m-d H:i' : 'Y-m-d H:i',
      time_24hr: true,
      defaultDate: this.dateTime() ? new Date(this.dateTime()) : new Date(),
      onChange: (selectedDates: Date[]) => {
        if (selectedDates.length > 0) {
          const formattedDate = this.formatLocalDateTime(selectedDates[0]);
          this.value = formattedDate;
          this.onChange(formattedDate);
          this.dateTimeChange.emit(formattedDate);
          this.stateChanges.next();
        }
      },
      onClose: (selectedDates: Date[]) => {
        if (selectedDates.length > 0) {
          const formattedDate = this.formatLocalDateTime(selectedDates[0]);
          this.value = formattedDate;
          this.onChange(formattedDate);
          this.dateTimeChange.emit(formattedDate);
          this.stateChanges.next();
        }
      }
    };

    if (this.formatType() === 'hour') {
      options['minuteIncrement'] = 60;
      options['noCalendar'] = false;
    }

    if (this.formatType() === 'date-only') {
      options['enableTime'] = false;
    }

    this.flatpickrInstance = flatpickr(this.inputElement.nativeElement, options);
  }

  get empty() {
    return !this.value;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.inputElement.nativeElement.focus();
    }
  }

  onBlur() {
    this.onTouched();
    this.touched = true;
    this.stateChanges.next();
  }

  private formatLocalDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  writeValue(value: string | null): void {
    if (value === '') {
      value = null;
    }
    this.value = value;
    if (this.flatpickrInstance) {
      this.flatpickrInstance.setDate(value ? new Date(value) : new Date(), true);
    }
    this.stateChanges.next();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.inputElement) {
      this.inputElement.nativeElement.disabled = isDisabled;
    }
  }
}