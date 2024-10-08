import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, Optional, Self, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { ControlValueAccessor, ReactiveFormsModule, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'app-date-time-picker',
  template: `
    <input matInput type="datetime-local" [value]="dateTime" (input)="onDateTimeChange($event)" #inputElement>
  `,
  styles: [`
    :host {
      width: 100%;
    }
    .date-time-picker {
      width: 100%;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: DateTimePickerComponent,
    },
  ],
})
export class DateTimePickerComponent implements ControlValueAccessor, MatFormFieldControl<string>, OnInit, OnDestroy, AfterViewInit {
  static nextId = 0;
  @Input() dateTime: string | null = null;
  @Output() dateTimeChange = new EventEmitter<string>();
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'app-date-time-picker';
  id = `app-date-time-picker-${DateTimePickerComponent.nextId++}`;
  describedBy = '';
  onChange = (value: string) => {};
  onTouched = () => {};
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  value: string;
  placeholder: string;
  required: boolean;
  disabled: boolean;
  errorState: boolean;
  autofilled?: boolean;
  userAriaDescribedBy?: string;

  ngOnInit() {
    if (!this.dateTime || this.isDateTimeNow(this.dateTime)) {
      this.setCurrentDateTime();
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
  }

  private isDateTimeNow(dateTime: string): boolean {
    const now = new Date();
    const formattedNow = this.formatLocalDateTime(now);
    return dateTime === formattedNow;
}

  get empty() {
    return !this.dateTime;
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

  onDateTimeChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    const localDate = new Date(value);
    const formattedDate = this.formatLocalDateTime(localDate);
    this.dateTime = formattedDate;
    this.dateTimeChange.emit(formattedDate);
    this.onChange(formattedDate);
    this.onTouched();
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

  private setCurrentDateTime() {
    const now = new Date();
    const formattedNow = this.formatLocalDateTime(now);
    this.dateTime = formattedNow;
    this.dateTimeChange.emit(formattedNow);
    this.onChange(formattedNow);
    this.stateChanges.next();
  }

  writeValue(value: string | null): void {
    if (value) {
      const date = new Date(value);
      this.dateTime = this.formatLocalDateTime(date);
    } else {
      this.setCurrentDateTime();
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
    if (this.inputElement) {
      this.inputElement.nativeElement.disabled = isDisabled;
    }
  }

  onBlur() {
    this.onTouched();
    this.touched = true;
    this.stateChanges.next();
  }
}