import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { Controllers, Methods } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';

@Component({
  selector: 'app-set-bet-value',
  templateUrl: './set-bet-value.component.html',
  styleUrl: './set-bet-value.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
})
export class SetBetValueComponent implements OnInit {
  isSendingRequest = false;
  product: any; 
  betValues: any = {};
  currencies: string[] = [];
  selectedCurrency: string = '';
  selectedValues: any = {};
  selectedCurrencies: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<SetBetValueComponent>,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit() {
    this.product = this.data.productData
    this.parseBetValues()
  }

  parseBetValues(): void {
    if (this.product && this.product.BetValues) {
      try {
        this.betValues = JSON.parse(this.product.BetValues);
        this.currencies = Object.keys(this.betValues);        

        this.initializeSelectedValues();
      } catch (error) {
        console.error('Error parsing BetValues JSON:', error);
      }
    }

    if(this.currencies.length == 0) {
      SnackBarHelper.show(this._snackBar, { Description: "This product does not support bet value changes.", Type: "info" });
      this.close();
    }
  }

  initializeSelectedValues(): void {
    if (this.data.product.BetValues) {
      this.selectedValues = JSON.parse(this.data.product.BetValues);
      this.selectedCurrencies = Object.keys(this.selectedValues);
    }
  }

  close() {
    this.dialogRef.close();
  }

  onCurrencyChange(currency: string): void {
    this.selectedCurrency = currency;
    if (!this.selectedValues[currency]) {
      this.selectedValues[currency] = null;
    }
    if (!this.selectedCurrencies.includes(currency)) {
      this.selectedCurrencies.push(currency);
    }
  }

  onSelectValue(currency: string, value: number): void {
    this.selectedValues[currency] = value;    
  }

  removeCurrency(currency: string): void {
    delete this.selectedValues[currency];
    this.selectedCurrencies = this.selectedCurrencies.filter(cur => cur !== currency);
  }

  getPercentValue(params) {
    let percent;

    if (!!params.Lines || !!params.CoinValue || !!params.Coins) {
      percent = 0;
    } else {
      percent = null;
    }
    return params.Percent ? Number(params.Percent) : percent;
  }

  onSubmit() {
    if (!this.isSendingRequest) {
      this.isSendingRequest = true;
      let betValues = JSON.stringify(this.selectedValues);
      if (Object.keys(this.selectedValues).length === 0 && this.selectedValues.constructor === Object) {
        betValues = null;
    }
      const product = this.data.product.Settings;
      product.Percent = this.getPercentValue(this.data.product);
      product.Lines = this.data.product?.Lines ? Number(this.data.product?.Lines) : null
      product.CoinValue = this.data.product?.CoinValue ? Number(this.data.product?.CoinValue) : null;
      product.Coins = this.data.product?.Coins ? Number(this.data.product?.Coins) : null;
      product.Count = this.data.product?.Count ? Number(this.data.product?.Count) : null;
      product.BetValues = betValues;
  
      const requestBody = {
        Id: this.data.bonusId,
        Name: this.data.product.Name,
        Status: this.data.product.State,
        Products: [product],
      };
      
      this.apiService.apiPost(this.configService.getApiUrl, requestBody,
        true,  Controllers.BONUS, Methods.UPDATE_BONUS)
        .pipe(take(1))
        .subscribe(data => {
          if (data.ResponseCode === 0) {
            this.dialogRef.close(betValues);
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
          this.isSendingRequest = false;
        }, error => {
          SnackBarHelper.show(this._snackBar, { Description: 'An error occurred', Type: "error" });
          this.isSendingRequest = false;
        });
    }
  }
}