import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CoreApiService } from '../../../services/core-api.service';
import { ConfigService } from 'src/app/core/services';
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';

@Component({
  selector: 'app-add-bet-values',
  templateUrl: './add-bet-values.component.html',
  styleUrls: ['./add-bet-values.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule
  ]
})

export class AddBetValuesComponent implements OnInit {
  public betValues: { [currency: string]: number[] } = {};
  public currencies: { Id: string, Name: string }[] = [];
  public valueOptions: number[] = [];
  form: FormGroup;
  newCurrency: string = '';
  newValue: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddBetValuesComponent>,
    private apiService: CoreApiService,
    private configService: ConfigService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit(): void {
    this.parseLogValues(JSON.parse(this.data));
    this.getCurrencies();
    this.initializeForm();
  }

  getCurrencyKeys(): string[] {
    return Object.keys(this.betValues);
  }

  parseLogValues(data: any) {
    if (typeof data !== 'object' || data === null) {
      console.error('Invalid data format: Expected an object but received', data);
      return;
    }

    this.betValues = {}; // Clear existing values

    for (let currency in data) {
      if (data.hasOwnProperty(currency)) {
        const values = data[currency];
        if (Array.isArray(values)) {
          this.betValues[currency] = values;
        } else {
          console.error(`Expected an array of values for currency ${currency}, but received:`, values);
        }
      }
    }
  }

  addCondition(currency: string, value: number) {
    if (!this.betValues[currency]) {
      this.betValues[currency] = [];
    }

    if (!this.betValues[currency].includes(value)) {
      this.betValues[currency].push(value);
    }

    this.form.patchValue({
      value: null
    });
  }

  removeValue(currency: string, value: number) {
    if (this.betValues[currency]) {
      const index = this.betValues[currency].indexOf(value);
      if (index !== -1) {
        this.betValues[currency].splice(index, 1);
        // Remove currency if no values are left
        if (this.betValues[currency].length === 0) {
          delete this.betValues[currency];
        }
      }
    }    
  }

  removeCurrency(currency: string) {
    if (this.betValues[currency]) {
      delete this.betValues[currency];
    }
  }
  
  
  initializeForm() {
    this.form = this.fb.group({
      currencyId: [null, Validators.required],
      value: [null, Validators.required]
    });
  }

  getCurrencies() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.CURRENCY, Methods.GET_CURRENCIES)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.currencies = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onCurrencyChange(currencyId: string) {
    const selectedCurrency = this.currencies.find(currency => currency.Id === currencyId);
    if (selectedCurrency) {
      this.valueOptions = this.betValues[selectedCurrency.Name] || [];
      this.form.patchValue({ value: this.valueOptions[0] });
    }
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    const data = JSON.stringify(this.betValues);
    this.dialogRef.close(data);
  }
}