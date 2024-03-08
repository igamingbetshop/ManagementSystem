import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { take } from "rxjs";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

import { Controllers, Methods } from "src/app/core/enums";
import { SnackBarHelper } from "src/app/core/helpers/snackbar.helper";
import { CommonDataService, ConfigService } from "src/app/core/services";
import { CoreApiService } from "../../../services/core-api.service";

@Component({
  selector: "app-add-currency-settings",
  templateUrl: "./add-currency-settings.component.html",
  styleUrls: ["./add-currency-settings.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class AddCurrencySettingsComponent implements OnInit {
  formGroup: UntypedFormGroup;
  currencies = [];
  isUpToAmount?: boolean;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddCurrencySettingsComponent>,
    public commonDataService: CommonDataService,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getCurrencies();
    this.formValues();
    this.isUpToAmount = this.data?.isUpToAmmount;
  }

  getCurrencies() {
    this.apiService
      .apiPost(
        this.configService.getApiUrl,
        {},
        true,
        Controllers.CURRENCY,
        Methods.GET_CURRENCIES
      )
      .pipe(take(1))
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.currencies = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, {
            Description: data.Description,
            Type: "error",
          });
        }
      });
  }

  formValues() {
    this.formGroup = this.fb.group({
      CurrencyId: [null, [Validators.required]],
      MinAmount: [null, [Validators.required]],
      MaxAmount: [null],
      UpToAmount: [null],
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    } else {
      let obj = this.formGroup.getRawValue();

      this.dialogRef.close(obj);
    }
  }

  get errorControl() {
    return this.formGroup.controls;
  }
}
