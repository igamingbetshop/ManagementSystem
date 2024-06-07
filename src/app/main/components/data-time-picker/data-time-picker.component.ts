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
    if (!this.dateTime) {
      this.setCurrentDateTime();
    } else {
      this.dateTime = this.formatDateTime(this.dateTime);
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
    this.dateTime = value;
    this.dateTimeChange.emit(value);
    this.onChange(value);
    this.onTouched();
    this.stateChanges.next();
  }

  writeValue(value: string): void {
    if (value) {
      this.dateTime = this.formatDateTime(value);
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
    // this.inputElement.nativeElement.disabled = isDisabled;
  }

  onBlur() {
    this.onTouched();
    this.touched = true;
    this.stateChanges.next();
  }

  private setCurrentDateTime() {
    this.dateTime = this.getCurrentDateTime();
    this.stateChanges.next();
  }

  private getCurrentDateTime(): string {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }

  private formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 16);
  }
}