import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-select',
  template: `
    <mat-form-field>
      <mat-label>{{ label() | translate }}</mat-label>
      <mat-select 
        [placeholder]="placeholder() | translate" 
        [(ngModel)]="value" 
        (blur)="onTouched()" 
        (selectionChange)="onChange($event.value)"
        [multiple]="multiple()" > 
        @for (option of options(); track $index) {
          <mat-option [value]="option.Id">
            {{ option.Name }}
          </mat-option>
        }
      </mat-select>
      @if(errorControl().touched && errorControl().hasError('required')) {
        <mat-error>
          {{ label() | translate }} {{ 'Errors.Required' | translate }}
        </mat-error>
      }
    </mat-form-field>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
    `,
  ],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
  ],
})
export class CustomSelectComponent implements ControlValueAccessor {
    label = input<string>();; 
    placeholder = input<string>();
    multiple= input<boolean>(); 
    options = input<{ Id: string | number; Name: string }[]>();  
    errorControl = input< FormControl | null>();

  value: any;

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
  }
}
