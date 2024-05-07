import {Component, Inject, OnInit} from '@angular/core';
import {Controllers, Methods} from "../../../../../../core/enums";
import {take} from "rxjs/operators";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommonDataService, ConfigService} from "../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import {DateAdapter} from "@angular/material/core";

@Component({
  selector: 'app-add-deposit-form',
  templateUrl: './add-deposit-form.component.html',
  styleUrls: ['./add-deposit-form.component.scss']
})
export class AddDepositFormComponent implements OnInit {
  partnerBanks = [];
  partnerId;
  selectedBank = {
    Accounts: []
  };
  fromDate = new Date();
  formGroup: UntypedFormGroup;
  isSendingReqest = false; 

  constructor(public dialogRef: MatDialogRef<AddDepositFormComponent>,
              private apiService: CoreApiService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder,
              public commonDataService: CommonDataService,
              @Inject(MAT_DIALOG_DATA) private data,
              public dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.partnerId = this.data.partnerId;
    this.getPartnerBanks();
    this.formValues();
  }

  close() {
    this.dialogRef.close();
  }

  getPartnerBanks() {
    this.apiService.apiPost(this.configService.getApiUrl, this.partnerId, true,
      Controllers.PARTNER, Methods.GET_PARTNER_BANKS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.partnerBanks = data.ResponseObject;
      }
    });
  }

  changeBank() {
    this.selectedBank = this.partnerBanks.find(bank => bank.Id == this.formGroup.get('BankName').value);
  }

  onStartDateChange(event) {
    this.fromDate = event.value;
  }

  submit() {
    if (!this.formGroup.valid) {
      return;
    }
    this.isSendingReqest = true; 
    const setting = this.formGroup.getRawValue();
    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.PAYMENT, Methods.CREATE_PAYMENT_FORM_REQUEST).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
      this.isSendingReqest = false;
    });
  }

  uploadFile(event) {
    var files = event.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();

      reader.onload = () => {
        const binaryString = reader.result as string;
        this.formGroup.get('PaymentForm').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
      };

      reader.readAsDataURL(file);
      this.formGroup.get('ImageName').setValue(file.name)
    }
  }

  private formValues() {
    this.formGroup = this.fb.group({
      PartnerId: [this.partnerId],
      TransactionDate: [this.fromDate],
      BankName: [null],
      BankAccountNumber: [''],
      Amount: [null],
      ImageName: [''],
      PaymentForm: [''],
      ClientIdentifier: [''],
      Type: [2]
    })
  }

  get errorControl() {
    return this.formGroup.controls;
  }

}
